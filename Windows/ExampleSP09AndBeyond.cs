public class FileCertificateProvider : SAP.CertificateProvider.ICertificateProvider {
       private Certificate certificate = null;
 
       public async IAsyncAction InitializeAsync() {
              var pfx = await Windows.Storage.StorageFile.GetFileFromApplicationUriAsync(new Uri("ms-appx:/// personalCertificate.pfx"));
              byte[] rawCert = null;
              using (var stream = await pfx.OpenReadAsync()) {
                     using (var reader = new BinaryReader(stream.AsStreamForRead())) {
                           rawCert = reader.ReadBytes((int)stream.Size);
 
                           var base64Cert = Windows.Security.Cryptography.CryptographicBuffer.EncodeToBase64String(rawCert.AsBuffer());
                           await Windows.Security.Cryptography.Certificates.CertificateEnrollmentManager.ImportPfxDataAsync(
                                         base64Cert, " YOUR_CERTIFICATE_PASSWORD ",
                                         ExportOption.NotExportable,
                                         KeyProtectionLevel.NoConsent,
                                         InstallOptions.DeleteExpired, "userCert"
                             );
 
                           IReadOnlyList<Windows.Security.Cryptography.Certificates.Certificate> certs = await Windows.Security.Cryptography.Certificates.CertificateStores.FindAllAsync(new Windows.Security.Cryptography.Certificates.CertificateQuery() { FriendlyName = "userCert" });
                            this.certificate = certs.FirstOrDefault();
                     }
              }
       }
 
       public Certificate GetCertificate() {
              return this.certificate;
       }
 
       public IAsyncAction DeleteStoredCertificateAsync() {
              return Task.Run(() => { this.certificate = null; }).AsAsyncAction();
       }
 
}