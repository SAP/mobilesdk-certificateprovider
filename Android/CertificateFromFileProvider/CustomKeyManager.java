package com.example.certificatefromfileprovider;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.Socket;
import java.security.GeneralSecurityException;
import java.security.KeyStore;
import java.security.Principal;
import java.security.PrivateKey;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;

import javax.net.ssl.KeyManager;
import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.X509KeyManager;

import android.util.Log;

/**
 * The wrapper for keystores from a file. In this class, since the certificate
 * alias is specified, the class instance only represents a keystore for that
 * certificate. All other certificates in the keystore are invisible.
 */
class CustomKeyManager implements X509KeyManager {

	// The file key manager that contains the certificate described in
	// _certSource.
	private X509KeyManager _keyManager;
	private String _alias;

	/**
	 * @param keyManager
	 *            The keystore file that contains the specified certificate.
	 * @param password
	 *            The password to access the keystore file.
	 * @param alias
	 *            The alias of the certificate in that should be used.
	 */
	CustomKeyManager(String filepath, String password, String alias)
			throws Exception {
		_keyManager = loadCertificates(filepath, password);

		PrivateKey key = getPrivateKey(alias);
		if (key == null) {
			Log.w("CustomKeyManager",
					"Attempted to use certificate from keystore, but " + alias
							+ " is not in the keystore.");
			throw new Exception(
					"Attempted to use certificate from keystore, but " + alias
							+ " is not in the keystore.");
		}

		_alias = alias;
	}

	/**
	 * Load a keystore from file into key manager.
	 * 
	 * @param filepath
	 *            path of the keystore file.
	 * @param password
	 *            password of the keystore.
	 * @return A key manager instance for the keystore file.
	 * @throws AuthProxyException
	 */
	private X509KeyManager loadCertificates(String filepath, String password)
			throws Exception {
		Log.d("CustomKeyManager", "Loading certificate from file with path: "
				+ filepath);
		try {
			KeyStore keyStore = KeyStore.getInstance("PKCS12"); // We use only
																// this key
																// type. Any
																// other type
																// available?
			char[] pwd = null;
			if (password == null) {
				pwd = new char[0];
			} else {
				pwd = password.toCharArray();
			}

			// Construct a keystore instance from file.
			try {
				keyStore.load(new FileInputStream(new File(filepath)), pwd);
			} catch (FileNotFoundException fnfe) {
				// It's possible the user just gave the certificate filename
				// expecting us to look on the SD card,
				// so check for that.
				String sDCardFilepath = "mnt/sdcard/" + filepath;
				Log.d("CustomKeyManager",
						"Certificate not found, trying path: " + sDCardFilepath);
				try {
					keyStore.load(
							new FileInputStream(new File(sDCardFilepath)), pwd);
				} catch (FileNotFoundException fnfe2) {
					Log.e("CustomKeyManager",
							"Attempted to use certificate from file, but file does not exist.");
					throw fnfe2;
				} catch (CertificateException ce) {
					Log.e("CustomKeyManager",
							"Attempted to use certificate from file, but format of file is invalid: "
									+ ce.toString());
					throw ce;
				} catch (IOException ioe) {
					Log.e("CustomKeyManager",
							"Attempted to use certificate from file, but format of file is invalid: "
									+ ioe.toString());
					throw ioe;
				}
			} catch (CertificateException ce) {
				Log.e("CustomKeyManager",
						"Attempted to use certificate from file, but format of file is invalid: "
								+ ce.toString());
				throw ce;
			} catch (IOException ioe) {
				Log.e("CustomKeyManager",
						"Attempted to use certificate from file, but format of file is invalid: "
								+ ioe.toString());
				throw ioe;
			}

			KeyManagerFactory oKMF = KeyManagerFactory
					.getInstance(KeyManagerFactory.getDefaultAlgorithm());
			oKMF.init(keyStore, pwd);
			for (KeyManager oKM : oKMF.getKeyManagers()) {
				if (oKM instanceof X509KeyManager) {
					return (X509KeyManager) oKM;
				}
			}

			return null; // Should not reach here
		} catch (GeneralSecurityException gse) {
			Log.e("CustomKeyManager",
					"GeneralSecurityException while loading certificates: "
							+ gse.toString());
			throw gse;
		}
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see javax.net.ssl.X509KeyManager#chooseClientAlias(java.lang.String[],
	 * java.security.Principal[], java.net.Socket)
	 * 
	 * @return Return the preselected alias.
	 */
	@Override
	public String chooseClientAlias(String[] keyType, Principal[] issuers,
			Socket socket) {
		return _alias;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see javax.net.ssl.X509KeyManager#chooseServerAlias(java.lang.String,
	 * java.security.Principal[], java.net.Socket) This method is only required
	 * for server application.
	 */
	@Override
	public String chooseServerAlias(String keyType, Principal[] issuers,
			Socket socket) {
		return null;
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see javax.net.ssl.X509KeyManager#getCertificateChain(java.lang.String)
	 */
	@Override
	public X509Certificate[] getCertificateChain(String alias) {
		return _keyManager.getCertificateChain(alias);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see javax.net.ssl.X509KeyManager#getClientAliases(java.lang.String,
	 * java.security.Principal[])
	 */
	@Override
	public String[] getClientAliases(String keyType, Principal[] issuers) {
		return _keyManager.getClientAliases(keyType, issuers);
	}

	/*
	 * (non-Javadoc)
	 * 
	 * @see javax.net.ssl.X509KeyManager#getServerAliases(java.lang.String,
	 * java.security.Principal[]) This method is only required for server
	 * application.
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
	@Override
	public PrivateKey getPrivateKey(String alias) {
		return _keyManager.getPrivateKey(alias);
	}

}
