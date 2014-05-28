package com.example.certificatefromsystemprovider;

import java.net.Socket;
import java.security.Principal;
import java.security.PrivateKey;
import java.security.cert.X509Certificate;

import javax.net.ssl.X509KeyManager;

import android.annotation.TargetApi;
import android.app.Activity;
import android.os.Build;
import android.security.KeyChain;
import android.security.KeyChainAliasCallback;
import android.security.KeyChainException;
import android.util.Log;

/**
 * Wrapper for system key managers. 
 * Using this class requires Android 4.0 or later, since that is when the system keychain was introduced.
 *
 */
class CustomKeyManager implements X509KeyManager {
	
	private Activity _containerActivity;
	// The alias is passed into the constructor.  If a certificate with that alias exists in the
	// system keychain, then it will be pre-selected in the system dialog that appears.  However,
	// if the user selects a different certificate, this variable will be overwritten with its alias.
	private String _alias;
	
	// To indicate whether the KeyChain is initialized.
	// For Android 4.x, the KeyChain must first be initialized by popping up dialog before any access of it.
	private boolean _keyChainInitialized = false;
	
	private boolean _notified = false;
	
	/**
	 * Construct a instance of system key manager with specified certificate source descriptor.
	 * @param cs The certificate source descriptor.
	 * @param containingWebView the context of the containing WebView.
	 * @throws AuthProxyException When there is no KeyChain available in the runtime, or alias not present.
	 */
	CustomKeyManager(Activity containingWebView, String alias) {
        
        _containerActivity = containingWebView;
        _alias = alias;
        
        // If the keychain is initialized, check whether the alias is valid
        if (_keyChainInitialized) {
            if (getPrivateKey(_alias) == null) {
                Log.e("CustomCertProvider","Uh-oh, there is no certificate with that alias.");
            }
        }
	}

	/**
	 * Pop-up the Android system key manager dialog to initialize the Android system KeyChain. 
	 * It must be called once before any KeyChain method is called. Otherwise, users could not use this feature.
	 * @param keyTypes the list of public key algorithm names.
	 * @param issuers the list of certificate issuers, or null if any issuer will do.
	 * @param socket the socket for the connection, or null if the alias selected does not depend on a specific socket.
	 * @param alias preselected certificate alias.
	 * @return The  alias of the selected certificate.
	 */
	@TargetApi(Build.VERSION_CODES.ICE_CREAM_SANDWICH)
	private String initializeKeyChain(String[] keyTypes, Principal[] issuers, Socket socket, String alias) {
		if (_keyChainInitialized && alias != null) {
			return alias;
		}
		
		synchronized (CustomKeyManager.class) { // Synchronize with the class itself
			try {
				if (keyTypes == null) {
					keyTypes = new String[] { "RSA" };
				}

				String host = null;
				int port = -1;
				if (socket != null) {
					host = socket.getInetAddress().toString();
					port = socket.getPort();
				}
				
				_notified = false;

				KeyChain.choosePrivateKeyAlias(_containerActivity, new KeyChainAliasCallback() {
							@Override
							public void alias(String selectedAlias) {
								CustomKeyManager.this._alias = selectedAlias;
								CustomKeyManager.this._notified = true;
								synchronized (CustomKeyManager.this) {
									CustomKeyManager.this.notify();
								}
							}
						}, keyTypes, issuers, host, port, alias);

				try { // Make the thread waiting for the system keychain dialog closed.
					synchronized (this) {
						while(!_notified) {
							this.wait();
						}
					}
				} catch (InterruptedException e) {
					Log.e("CustomCertProvider", "InteruptedException: " + e.getLocalizedMessage());
				}

				return _alias;

			} finally {
			    _keyChainInitialized = true;
			}
		}
	}
	
	/* (non-Javadoc)
	 * @see javax.net.ssl.X509KeyManager#chooseClientAlias(java.lang.String[], java.security.Principal[], java.net.Socket)
	 */
	@Override
	public String chooseClientAlias(String[] keyType, Principal[] issuers, Socket socket) {
		_alias = initializeKeyChain(keyType, issuers, socket, _alias);
		return _alias;
	}

	/* (non-Javadoc)
	 * @see javax.net.ssl.X509KeyManager#chooseServerAlias(java.lang.String, java.security.Principal[], java.net.Socket)
	 * This is only required for server applications.
	 */
	@Override
	public String chooseServerAlias(String keyType, Principal[] issuers, Socket socket) {
		return null;
	}

	/* (non-Javadoc)
	 * @see javax.net.ssl.X509KeyManager#getCertificateChain(java.lang.String)
	 */
	@TargetApi(Build.VERSION_CODES.ICE_CREAM_SANDWICH)
	@Override
	public X509Certificate[] getCertificateChain(String alias) {
		try {
			return KeyChain.getCertificateChain(_containerActivity, alias);
		} catch (KeyChainException e) {
			e.printStackTrace();
			return null;
		} catch (InterruptedException e) {
			e.printStackTrace();
			return null;
		}
	}

	/* (non-Javadoc)
	 * @see javax.net.ssl.X509KeyManager#getClientAliases(java.lang.String, java.security.Principal[])
	 * The Android KeyChain does not support this feature, so we could not provide it either.
	 */
	@Override
	public String[] getClientAliases(String keyType, Principal[] issuers) {
		if(_alias != null){
			String[] aliases = new String[1];
			aliases[0] = _alias;
			return aliases;
		} else {
			return null;
		}
	}

	/* (non-Javadoc)
	 * @see javax.net.ssl.X509KeyManager#getServerAliases(java.lang.String, java.security.Principal[])
     * This is only required for server applications.
	 */
	@Override
	public String[] getServerAliases(String keyType, Principal[] issuers) {
		return null;
	}

	/* (non-Javadoc)
	 * @see javax.net.ssl.X509KeyManager#getPrivateKey(java.lang.String)
	 */
	@TargetApi(Build.VERSION_CODES.ICE_CREAM_SANDWICH)
	@Override
	public PrivateKey getPrivateKey(String alias) {
		// There is a bug in Android 4.1 that will cause the call to KeyChain.getPrivateKey to result in
		// a segfault later.  For more info see https://code.google.com/p/android/issues/detail?id=36545
		// So, check if the Android version is 4.1, and if it is just return null.  It will still cause
		// CertficateFromStore to fail, but at least it will fail less spectacularly.
		if(android.os.Build.VERSION.RELEASE.startsWith("4.1")){
			Log.e("CustomCertProvider",
					"Returning null for the private key. Due to an issue with Android 4.1, getting the real private key would cause this app to crash.");
			return null;
		}
		PrivateKey pk = null;
		try {
		    pk = KeyChain.getPrivateKey(_containerActivity, alias);
		} catch (KeyChainException e) {
			Log.e("CustomCertProvider", "KeyChainException while getting private key: " + e.toString());
		} catch (InterruptedException e) {
			Log.e("CustomCertProvider", "InteruptedException while getting private key: " + e.toString());
		}
		
		return pk;
	}
	
}
