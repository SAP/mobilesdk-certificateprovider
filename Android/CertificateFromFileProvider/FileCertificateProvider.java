package com.example.certificatefromfileprovider;

import java.util.Map;

import javax.net.ssl.X509KeyManager;

import android.app.Activity;
import android.app.AlertDialog;
import android.app.AlertDialog.Builder;
import android.content.DialogInterface;
import android.text.InputType;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.sap.smp.client.android.certificateprovider.CertificateProvider;
import com.sap.smp.client.android.certificateprovider.CertificateProviderException;
import com.sap.smp.client.android.certificateprovider.CertificateProviderListener;

public class FileCertificateProvider implements CertificateProvider {
	private String _alias = "defaultAlias";
	private String _filePath = "defaultFilePath";
	private String _certPwd = "defaultPassword";
	private String _appId;
	private Activity _activity;
	private CertificateProviderListener _certProviderListener;

	@Override
	public void deleteStoredCertificate() {
		// You can delete any stored certificates here
	}

	@Deprecated
	@Override
	public void getCertificate(CertificateProviderListener arg0) {
		// This function is only used in the SMP case.
		CustomKeyManager keyManager = null;
		try {
			keyManager = new CustomKeyManager(_filePath, _certPwd, _alias);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		arg0.onGetCertificateSuccess(keyManager);
	}

	@Override
	public X509KeyManager getStoredCertificate() {
		// This function is how the certificate is retrieved synchronously.
		CustomKeyManager keyManager = null;
		try {
			keyManager = new CustomKeyManager(_filePath, _certPwd, _alias);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return keyManager;
	}

	@Deprecated
	@Override
	public void setParameters(Map arg0) {
		// This function can be used to get the activity.
		_appId = (String) arg0.get(CertificateProvider.ANDROID_APPID_KEY);
		_activity = (Activity) arg0.get(CertificateProvider.ANDROID_CONTEXT_KEY);
	}

	@Override
	public void initialize(CertificateProviderListener listener) throws CertificateProviderException {
		_certProviderListener = listener;
		if (_activity != null) {
			showUI();
		}
	}

	private void showUI() {
		_activity.runOnUiThread(new Runnable() {

			@Override
			public void run() {

				LinearLayout topLayout = new LinearLayout(_activity);
				topLayout.setOrientation(LinearLayout.VERTICAL);
				topLayout.setMinimumWidth(600);
				LinearLayout.LayoutParams matchParentParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.MATCH_PARENT);
				topLayout.setLayoutParams(matchParentParams);

				TextView textView = new TextView(_activity);
				textView.setText("Enter the certificate information below:");
				topLayout.addView(textView);

				final EditText userNameEdit = new EditText(_activity);
				userNameEdit.setHint("Filepath");
				topLayout.addView(userNameEdit);

				final EditText aliasEdit = new EditText(_activity);
				aliasEdit.setHint("Alias");
				topLayout.addView(aliasEdit);

				final EditText passcodeEdit = new EditText(_activity);
				passcodeEdit.setHint("Password");
				passcodeEdit.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
				topLayout.addView(passcodeEdit);

				final Builder authDialog = new AlertDialog.Builder(_activity).setTitle("Enter Credentials").setView(topLayout).setCancelable(false)
						.setPositiveButton("OK", new DialogInterface.OnClickListener() {
							@Override
							public void onClick(DialogInterface dialog, int whichButton) {
								_filePath = userNameEdit.getText().toString();
								_certPwd = passcodeEdit.getText().toString();
								_alias = aliasEdit.getText().toString();
								// test to make sure it's a valid cert and password
								try {
									new CustomKeyManager(_filePath, _certPwd, _alias);
								} catch (Exception e) {
									CharSequence text = "Filepath, alias, or password was incorrect.";
									int duration = Toast.LENGTH_SHORT;

									Toast toast = Toast.makeText(_activity, text, duration);
									toast.show();
									showUI();
									return;
								}
								_certProviderListener.initializationComplete();
							}
						});
				if (!_activity.isFinishing()) {
					authDialog.show();
				}
			}
		});
	}
}
