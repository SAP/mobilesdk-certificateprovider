package com.example.certificatefromsystemprovider;

import java.util.Map;

import javax.net.ssl.X509KeyManager;

import android.app.Activity;

import com.sap.maf.html5.android.CertificateProvider;
import com.sap.maf.html5.android.CertificateProviderException;
import com.sap.maf.html5.android.CertificateProviderListener;
import com.sap.maf.html5.android.MAFLogonCoreCDVPlugin;

public class CustomCertificateProvider implements CertificateProvider {
	private CertificateProviderListener _callback = null;
	private String _alias = "smp_crt";
	CustomKeyManager keyManager = null;

	@Override
	public void getCertificate(CertificateProviderListener callback) {
		_callback = callback;
		Activity currentActivity = MAFLogonCoreCDVPlugin.getInstance().getActivity();
		keyManager = new CustomKeyManager( currentActivity, _alias);
		
		// This makes the system dialog appear now instead of whenever the keyManager is requested for credentials.
		keyManager.chooseClientAlias(null, null, null);
		
		_callback.onGetCertificateSuccess(keyManager);
	}

	@Override
	// setParameters will never be called since CertificateProviderListener.showUI is never called.
	public void setParameters(Map parameters) {}

	@Override
	public void deleteStoredCertificate() throws CertificateProviderException {
		// Can't delete the certificate from the system keychain, so just set the keyManager to null
		keyManager = null;
	}

	@Override
	public X509KeyManager getStoredCertificate()
			throws CertificateProviderException {
		return keyManager;
	}
	
	
}
