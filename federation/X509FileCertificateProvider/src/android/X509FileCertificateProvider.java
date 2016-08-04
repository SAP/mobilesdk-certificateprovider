package com.sap.sample;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.widget.Toast;

import com.sap.smp.client.android.certificateprovider.CertificateProvider;
import com.sap.smp.client.android.certificateprovider.CertificateProviderException;
import com.sap.smp.client.android.certificateprovider.CertificateProviderListener;
import com.sap.smp.client.android.certificateprovider.CertificateProviderListenerPlus;

import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;

import java.util.HashMap;
import java.util.Map;

import javax.net.ssl.X509KeyManager;

public class X509FileCertificateProvider extends CordovaPlugin implements CertificateProvider {

    private static final String LOG_TAG = "X509_FILE_PROVIDER";
    protected static final String PROVIDER_FILENAME = "com.sap.fileprovider.filename";
    protected static final String PROVIDER_PASSWORD = "com.sap.fileprovider.password";

    private static String _filePath;
    private static String _certPwd;
    private String _appId;
    private static Context ctx;
    private static CertificateProviderListenerPlus _certProviderListener;

    private static final class SingletonHolder {

        public static final X509FileCertificateProvider F_PROVIDER = new X509FileCertificateProvider();
    }

    public static X509FileCertificateProvider getInstance() {
        return SingletonHolder.F_PROVIDER;
    }

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        // your init code here
    }

    @Override
    public void initialize(final CertificateProviderListener certificateProviderListener) throws CertificateProviderException {

        if (certificateProviderListener instanceof CertificateProviderListenerPlus) {

            _certProviderListener = (CertificateProviderListenerPlus) certificateProviderListener;
            if (ctx != null) {
                if (_filePath.length() == 0 || _certPwd.length() == 0) {
                    if (Looper.myLooper() == Looper.getMainLooper()) {
                        // ui thread
                        ctx.startActivity(new Intent(ctx, FileCertProviderActivity.class));
                    } else {
                        new Handler(Looper.getMainLooper()).post(new Runnable() {

                            @Override
                            public void run() {
                                ctx.startActivity(new Intent(ctx, FileCertProviderActivity.class));
                            }
                        });
                    }
                } else {
                    try {
                        CustomKeyManagerFactory.getX509KeyManager(ctx, _filePath, _certPwd);

                        Thread iThread = new Thread(new Runnable() {

                            @Override
                            public void run() {
                                Map<Object, Object> pms = new HashMap<Object, Object>();
                                pms.put(X509FileCertificateProvider.PROVIDER_FILENAME, _filePath);
                                pms.put(X509FileCertificateProvider.PROVIDER_PASSWORD, _certPwd);
                                _certProviderListener.initializationComplete(pms);
                            }
                        });
                        iThread.start();

                    } catch (Exception e) {
                        CharSequence msg = "Certificate provider initialization failed!";
                        Log.e(LOG_TAG, msg.toString());

                        if(ctx != null) {
                            final Toast toast = Toast.makeText(ctx, msg, Toast.LENGTH_LONG);

                            ((Activity) ctx).runOnUiThread(new Runnable() {
                                @Override
                                public void run() {
                                    toast.show();
                                }
                            });
                        }
                    }
                }
            }
        }
    }


    public CertificateProviderListenerPlus getCertificateProviderListener() {
        return _certProviderListener;
    }

    @Override
    public X509KeyManager getStoredCertificate() {
        // This function is how the certificate is retrieved synchronously.
        X509KeyManager keyManager = null;
        try {
            keyManager = CustomKeyManagerFactory.getX509KeyManager(ctx, _filePath, _certPwd);
        } catch (Exception e) {
            // TODO Auto-generated catch block
            e.printStackTrace();
        }
        return keyManager;
    }

    @Override
    public void deleteStoredCertificate() {

    }

    @Override
    public void getCertificate(CertificateProviderListener certificateProviderListener) {
        
        if (certificateProviderListener instanceof CertificateProviderListenerPlus) {
            // This function is only used in the SMP case.
            X509KeyManager keyManager = getStoredCertificate();
            certificateProviderListener.onGetCertificateSuccess(keyManager);
        }
    }

    @Override
    public void setParameters(Map<Object, Object> map) {

        // This function can be used to get the activity.
        if (map.containsKey(CertificateProvider.ANDROID_APPID_KEY)) {
            _appId = (String) map.get(CertificateProvider.ANDROID_APPID_KEY);
        }

        if (map.containsKey(CertificateProvider.ANDROID_CONTEXT_KEY)) {
            ctx = (Context) map.get(CertificateProvider.ANDROID_CONTEXT_KEY);
        }

        _filePath = map.get(PROVIDER_FILENAME) == null ? "" : map.get(PROVIDER_FILENAME).toString();
        _certPwd = map.get(PROVIDER_PASSWORD) == null ? "" : map.get(PROVIDER_PASSWORD).toString();
    }
}
