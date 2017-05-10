package com.example.systemcert;

import java.net.Socket;
import java.security.Principal;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

import javax.net.ssl.X509KeyManager;

import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.security.KeyChain;
import android.security.KeyChainAliasCallback;
import android.security.KeyChainException;
import android.util.Log;

/**
 * Wrapper for system key managers. For android before 4.0, no system key
 * manager available.
 *
 */
class SystemKeyManager implements X509KeyManager {

    private Activity _containerActivity;

    // A bridge variable to pass alias from KeyChain dialog to this class
    // instance.
    private String _tempAliasForDialog;

    private boolean _notified = false;

    private String _alias;

    private static SharedPreferences _sharedPrefs;
    private static final String SYSTEM_CERT_PROVIDER_SHARED_PREFERENCES = "SYSTEM_CERT_PROVIDER_SHARED_PREFERENCES";
    private static final String SYSTEM_KEY_MANAGER_SHARED_PREFERENCES_SELECTED_ALIAS = "selectedAlias";

    /**
     * Construct a instance of system key manager with specified certificate
     * source descriptor.
     *
     * @param containingWebView
     *            the context of the containing WebView.
     */
    SystemKeyManager(Activity containingWebView) {

        _containerActivity = containingWebView;
        if (_sharedPrefs == null) {
            _sharedPrefs = _containerActivity.getSharedPreferences(SYSTEM_CERT_PROVIDER_SHARED_PREFERENCES, Context.MODE_PRIVATE);
        }
        _alias = initializeKeyChain();
    }

    static void removeStoredAlias() {
        if (_sharedPrefs != null) {
            _sharedPrefs.edit().remove(SYSTEM_KEY_MANAGER_SHARED_PREFERENCES_SELECTED_ALIAS).apply();
        }
    }

    /**
     * Popup the Android system key manager dialog to initialize the Android
     * system KeyChain. It must be called once before any KeyChain method is
     * called. Otherwise, users could not use this feature.
     *
     * @return The alias of the selected certificate.
     */
    @TargetApi(Build.VERSION_CODES.ICE_CREAM_SANDWICH)
    private String initializeKeyChain() {

        // Check whether SystemKeyManager already got an alias
        String storedAlias = null;
        if (_sharedPrefs != null) {
            storedAlias = _sharedPrefs.getString(SYSTEM_KEY_MANAGER_SHARED_PREFERENCES_SELECTED_ALIAS, null);
            if (storedAlias != null) {
                return storedAlias;
            }
        }

        // Synchronize with the class itself
        synchronized (SystemKeyManager.class) {
            String[] keyTypes = new String[] { "RSA" };

            String host = null;
            int port = -1;

            _notified = false;

            KeyChain.choosePrivateKeyAlias(_containerActivity, new KeyChainAliasCallback() {
                @Override
                public void alias(String selectedAlias) {
                    SystemKeyManager.this._tempAliasForDialog = selectedAlias;
                    SystemKeyManager.this._notified = true;
                    synchronized (SystemKeyManager.this) {
                        SystemKeyManager.this.notifyAll();
                    }
                }
            }, keyTypes, null, host, port, null);

            try {
                // Make the thread wait for the system keychain dialog to be
                // closed.
                synchronized (this) {
                    while (!_notified) {
                        this.wait();
                    }
                }
            } catch (InterruptedException e) {
                Log.e("CertProvider", "InteruptedException: " + e.toString());
            }

            _sharedPrefs.edit().putString(SYSTEM_KEY_MANAGER_SHARED_PREFERENCES_SELECTED_ALIAS, _tempAliasForDialog).apply();
            return _tempAliasForDialog;
        }
    }

    /*
     * (non-Javadoc)
     *
     * @see javax.net.ssl.X509KeyManager#chooseClientAlias(java.lang.String[],
     * java.security.Principal[], java.net.Socket)
     */
    @Override
    public String chooseClientAlias(String[] keyType, Principal[] issuers, Socket socket) {
        return _alias;
    }

    /*
     * (non-Javadoc)
     *
     * @see javax.net.ssl.X509KeyManager#chooseServerAlias(java.lang.String,
     * java.security.Principal[], java.net.Socket) This is only required for
     * server applications.
     */
    @Override
    public String chooseServerAlias(String keyType, Principal[] issuers, Socket socket) {
        return null;
    }

    /*
     * (non-Javadoc)
     *
     * @see javax.net.ssl.X509KeyManager#getCertificateChain(java.lang.String)
     */
    @TargetApi(Build.VERSION_CODES.ICE_CREAM_SANDWICH)
    @Override
    public X509Certificate[] getCertificateChain(String alias) {
        try {
            return KeyChain.getCertificateChain(_containerActivity, alias);
        } catch (KeyChainException e) {
            return null;
        } catch (InterruptedException e) {
            return null;
        }
    }

    /*
     * (non-Javadoc)
     *
     * @see javax.net.ssl.X509KeyManager#getClientAliases(java.lang.String,
     * java.security.Principal[]) The Android KeyChain does not support this
     * feature, so we could not provide it either.
     */
    @Override
    public String[] getClientAliases(String keyType, Principal[] issuers) {
        if (_alias != null) {
            return new String[] {_alias};
        } else {
            return new String[] {};
        }
    }

    /*
     * (non-Javadoc)
     *
     * @see javax.net.ssl.X509KeyManager#getServerAliases(java.lang.String,
     * java.security.Principal[]) This is only required for server applications.
     */
    @Override
    public String[] getServerAliases(String keyType, Principal[] issuers) {
        return null;
    }

    /*
     * (non-Javadoc)
     *
     * @see javax.net.ssl.X509KeyManager#getPrivateKey(java.lang.String)
     */
    @TargetApi(Build.VERSION_CODES.ICE_CREAM_SANDWICH)
    @Override
    public PrivateKey getPrivateKey(String alias) {
        // There is a bug in Android 4.1 that will cause the call to
        // KeyChain.getPrivateKey to result in a segfault later. For more info
        // see https://code.google.com/p/android/issues/detail?id=36545 So,
        // check if the Android version is 4.1, and if it is just return null.
        // It will still cause CertficateFromStore to fail, but at least it will
        // fail less spectacularly.
        if (Build.VERSION.RELEASE.startsWith("4.1")) {
            Log.e("CertProvider","Returning null for the private key. Due to an issue with Android 4.1, getting the real private key would cause this app to crash.");
            return null;
        }
        PrivateKey pk = null;
        try {
            pk = KeyChain.getPrivateKey(_containerActivity, alias);
        } catch (KeyChainException e) {
            // We no longer have permission to use the alias, must show the cert picker again.
            if (_sharedPrefs != null) {
                _sharedPrefs.edit().remove(SYSTEM_KEY_MANAGER_SHARED_PREFERENCES_SELECTED_ALIAS).apply();
            }
            String newAlias = initializeKeyChain();
            if (newAlias != null) {
                try {
                    pk = KeyChain.getPrivateKey(_containerActivity, newAlias);
                } catch (KeyChainException e1) {
                    Log.e("CertProvider","KeyChainException while getting private key, even after reinitializing the keychain: " + e.toString());
                } catch (InterruptedException e1) {
                    Log.e("CertProvider","InteruptedException while getting private key: " + e.toString());
                }
            }
        } catch (InterruptedException e) {
            Log.e("CertProvider", "InteruptedException while getting private key: " + e.toString());
        } catch (AssertionError e) {
            // An assertion error means something went terribly wrong.  This has only been observed
            // on a Samsung A3.  Instead of crashing, just log the error and return null for the
            // private key (pk should still be null).
            Log.e("CertProvider", "AssertionError while getting private key: " + e.getLocalizedMessage());
        }

        return pk;
    }

}
