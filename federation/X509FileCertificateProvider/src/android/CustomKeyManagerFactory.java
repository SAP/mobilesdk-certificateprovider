package com.sap.sample;

import android.content.Context;
import android.util.Log;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.cert.CertificateException;

import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.X509KeyManager;

/**
 * The wrapper for keystores from a file. In this class, since the certificate
 * alias is specified, the class instance only represents a keystore for that
 * certificate. All other certificates in the keystore are invisible.
 */
class CustomKeyManagerFactory {

    private static final String LOG_TAG = "CustomKeyManager";

    /**
     * Load a keystore from file into key manager.
     *
     * @param filepath path of the keystore file.
     * @param password password of the keystore.
     * @return A key manager instance for the keystore file.
     * @throws FileNotFoundException
     */
    public static X509KeyManager getX509KeyManager(Context ctx, String filepath, String password)
            throws FileNotFoundException, IOException, GeneralSecurityException {
        Log.d(LOG_TAG, "Loading certificate from file with path: " + filepath);
        try {
            KeyStore keyStore = KeyStore.getInstance("PKCS12");
            char[] pwd = null;
            if (password == null) {
                pwd = new char[0];
            } else {
                pwd = password.toCharArray();
            }
            String sDCardFilepath = "mnt/sdcard/" + filepath;


            // Construct a keystore instance from file.
            try {
                InputStream is = ctx.getAssets().open(filepath);
                keyStore.load(is, pwd);
            } catch (FileNotFoundException fnfe) {
                // It's possible the user just gave the certificate filename
                // expecting us to look on the SD card, so check for that.
                // String sDCardFilepath = "mnt/sdcard/" + filepath;
                Log.d(LOG_TAG,
                        "Certificate not found, trying path: " + sDCardFilepath);
                try {
                    keyStore.load(
                            new FileInputStream(new File(sDCardFilepath)), pwd);
                } catch (FileNotFoundException fnfe2) {
                    Log.e(LOG_TAG,
                            "Attempted to use certificate from file, but file does not exist.");
                    throw fnfe2;
                } catch (CertificateException ce) {
                    Log.e(LOG_TAG,
                            "Attempted to use certificate from file, but format of file is invalid: "
                                    + ce.toString());
                    throw ce;
                } catch (IOException ioe) {
                    Log.e(LOG_TAG,
                            "Attempted to use certificate from file, but format of file is invalid: "
                                    + ioe.toString());
                    throw ioe;
                }
            } catch (CertificateException ce) {
                Log.e(LOG_TAG, "Attempted to use certificate from file, but format of file is invalid: " + ce.toString());
                throw ce;
            } catch (IOException ioe) {
                Log.e(LOG_TAG,
                        "Attempted to use certificate from file, but format of file is invalid: "
                                + ioe.toString());
                throw ioe;
            }

            KeyManagerFactory oKMF = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
            oKMF.init(keyStore, pwd);
            for (KeyManager oKM : oKMF.getKeyManagers()) {
                if (oKM instanceof X509KeyManager) {
                    return (X509KeyManager) oKM;
                }
            }
            return null; // Should not reach here
        } catch (GeneralSecurityException gse) {
            Log.e(LOG_TAG,
                    "GeneralSecurityException while loading certificates: "
                            + gse.toString());
            throw gse;
        }
    }
}
