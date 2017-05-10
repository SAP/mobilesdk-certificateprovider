package com.example.systemcert;

import android.app.Activity;
import android.util.Log;

import com.sap.smp.client.android.certificateprovider.CertificateProvider;
import com.sap.smp.client.android.certificateprovider.CertificateProviderException;
import com.sap.smp.client.android.certificateprovider.CertificateProviderListener;

import java.util.Map;

import javax.net.ssl.X509KeyManager;

public class SystemCertProvider implements CertificateProvider {
    SystemKeyManager keyManager;
    Activity activity;

    @Override
    public void initialize(CertificateProviderListener certificateProviderListener) throws CertificateProviderException {
        if (activity != null) {
            keyManager = new SystemKeyManager(activity);
        }
        certificateProviderListener.initializationComplete();
    }

    @Override
    public X509KeyManager getStoredCertificate() {
        if (keyManager == null) {
            keyManager = new SystemKeyManager(activity);
        }
        return keyManager;
    }

    @Override
    public void deleteStoredCertificate() {
        if (keyManager != null) {
            keyManager.removeStoredAlias();
        }
    }

    /**
     * @param certificateProviderListener
     * @deprecated
     */
    @Override
    public void getCertificate(CertificateProviderListener certificateProviderListener) {
        certificateProviderListener.onGetCertificateSuccess(keyManager);
    }

    @Override
    public void setParameters(Map<Object, Object> map) {
        activity = (Activity)map.get("androidContext");
    }
}
