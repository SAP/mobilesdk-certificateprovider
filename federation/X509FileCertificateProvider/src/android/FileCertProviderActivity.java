package com.sap.sample;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.DialogInterface;
import android.os.Bundle;
import android.text.InputType;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

import java.util.HashMap;
import java.util.Map;

public class FileCertProviderActivity extends Activity {

	private String _filePath = "MAFTEST.p12";
	private String _certPwd = "Mobile123";

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		LinearLayout topLayout = new LinearLayout(this);
		topLayout.setOrientation(LinearLayout.VERTICAL);
		topLayout.setMinimumWidth(600);
		LinearLayout.LayoutParams matchParentParams = new LinearLayout.LayoutParams(LinearLayout.LayoutParams.MATCH_PARENT,
				LinearLayout.LayoutParams.MATCH_PARENT);
		topLayout.setLayoutParams(matchParentParams);

		TextView textView = new TextView(this);
		textView.setText("Enter the certificate information below:");
		topLayout.addView(textView);

		final EditText userNameEdit = new EditText(this);
		userNameEdit.setHint("Filepath");
		topLayout.addView(userNameEdit);

		final EditText passcodeEdit = new EditText(this);
		passcodeEdit.setHint("Password");
		passcodeEdit.setInputType(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_PASSWORD);
		topLayout.addView(passcodeEdit);

		userNameEdit.setText(_filePath);
		passcodeEdit.setText(_certPwd);

		final AlertDialog.Builder authDialog = new AlertDialog.Builder(this).setTitle("Enter Credentials").setView(topLayout)
				.setCancelable(true).setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int whichButton) {

                        _filePath = userNameEdit.getText().toString();
                        _certPwd = passcodeEdit.getText().toString();
                        // test to make sure it's a valid cert and password
                        try {
                            CustomKeyManagerFactory.getX509KeyManager(FileCertProviderActivity.this, _filePath, _certPwd);
                        } catch (Exception e) {
                            CharSequence text = "Filepath, alias, or password was incorrect.";
                            int duration = Toast.LENGTH_SHORT;

                            Toast toast = Toast.makeText(FileCertProviderActivity.this, text, duration);
                            toast.show();
							finish();
                        }

						Map<Object, Object> pms = new HashMap<Object, Object>();
						pms.put(X509FileCertificateProvider.PROVIDER_FILENAME, _filePath);
						pms.put(X509FileCertificateProvider.PROVIDER_PASSWORD, _certPwd);
                        X509FileCertificateProvider.getInstance().getCertificateProviderListener().initializationComplete(pms);
                        finish();
                    }
                });

		authDialog.show();
	}
}
