package com.example.certificatefromfileprovider;

import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Set;

import javax.net.ssl.X509KeyManager;

import org.json.JSONException;
import org.json.JSONObject;

import android.util.Log;

import com.sap.maf.html5.android.CertificateProvider;
import com.sap.maf.html5.android.CertificateProviderException;
import com.sap.maf.html5.android.CertificateProviderListener;
import com.sap.maf.html5.android.MAFLogonCoreCDVPlugin;
import com.sap.maf.tools.logon.core.LogonCore;
import com.sap.maf.tools.logon.core.LogonCoreException;

public class CustomCertificateProvider implements CertificateProvider {
	private CertificateProviderListener _callback = null;
	private String _alias = "smp_crt";
	private String _filePath = null;
	private String _certPwd = null;

	@Override
	public void getCertificate(CertificateProviderListener callback) {
		_callback = callback;
		try {
			// This map contains the view ID, as well as any information the view might need
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put(MAFLogonCoreCDVPlugin.VIEW_ID, "x509ProviderUI");
			// Now add a default value that will be displayed on the view.
			// This value is used in x509ProviderUI.view.js
			JSONObject settings = new JSONObject();
			try {
				settings.put("filepath", "certificate.p12");
			} catch (JSONException e) {
				// print exception to Logcat for debugging
				e.printStackTrace();
			}
			map.put("settings", settings);
			_callback.showUI(map);
		} catch (CertificateProviderException e) {
			// print exception to Logcat for debugging
			e.printStackTrace();
		}
	}

	@Override
	public void setParameters(Map parameters) {

		// Log the content of the parameters Map for debugging
		Log.e("CustomCertificateProvider", "setParameters called");
		Set keys = parameters.keySet();
		Iterator it = keys.iterator();
		while (it.hasNext()) {
			Object key = it.next();
			// assuming both key and value are strings
			Log.e("CustomCertificateProvider", "key: " + (String) key
					+ " value: " + (String) parameters.get(key));
		}

		_filePath = (String) parameters.get("filepath");
		_certPwd = (String) parameters.get("password");

		try {
			CustomKeyManager keyManager = new CustomKeyManager(_filePath, _certPwd, _alias);
			_callback.onGetCertificateSuccess(keyManager);
			// We won't be able to save the filepath and password to the logon core's datavault
			// before we are registered (since it won't exist at that point) but we can save
			// the values there later.
			LogonCore logonCore = LogonCore.getInstance();
			logonCore.addObjectToStore("CustomFileCertificateProvider_filePath", _filePath);
			logonCore.addObjectToStore("CustomFileCertificateProvider_certPwd", _certPwd);
		} catch (Exception e) {
			// print exception to Logcat for debugging
			e.printStackTrace();
		}
	}

	@Override
	public void deleteStoredCertificate() throws CertificateProviderException {
		// We're not actually going to try to delete the certificate off the filesystem.
		// Just get rid of the values we got from the user.
		_filePath = null;
		_certPwd = null;
	}

	@Override
	public X509KeyManager getStoredCertificate()
			throws CertificateProviderException {
		X509KeyManager keyManager = null;
		if (_filePath == null) {
			// If we don't have a value for the filepath, check the logon core's datavault
			// in case we previously saved the values there.
			LogonCore logonCore = LogonCore.getInstance();
			try {
				_filePath = logonCore.getObjectFromStore("CustomFileCertificateProvider_filePath");
				_certPwd = logonCore.getObjectFromStore("CustomFileCertificateProvider_certPwd");
			} catch (LogonCoreException e) {
				// print exception to logcat for debugging
				e.printStackTrace();
			}
		}
		if (_filePath != null) {
			try {
				keyManager = new CustomKeyManager(_filePath, _certPwd, _alias);
			} catch (Exception e) {
				// print exception to Logcat for debugging
				e.printStackTrace();
			}
		}
		return keyManager;
	}
}
