class CertificateProvider : SAP.Logon.Core.ICertificateProvider {
       public IAsyncAction DeleteStoredCertificateAsync() {
              return Task.Run(() => { }).AsAsyncAction();
       }
 
       public IAsyncOperation<SAP.Logon.Core.CertificateData> GetCertificateAsync() {
              return ReadCertificateAsync().AsAsyncOperation<SAP.Logon.Core.CertificateData>();
       }
 
       private async Task<SAP.Logon.Core.CertificateData> ReadCertificateAsync() {
              var pfx = await Windows.Storage.StorageFile.GetFileFromApplicationUriAsync(new Uri("ms-appx:///personalCertificate.pfx"));
              byte[] rawCert = null;
              using (var stream = await pfx.OpenReadAsync()) {
                     using (var reader = new BinaryReader(stream.AsStreamForRead())) {
                           rawCert = reader.ReadBytes((int)stream.Size);
                     }
              }
 
              return new SAP.Logon.Core.CertificateData() {
                     CertificateBlob = rawCert,
                     PfxKey = "YOUR_CERTIFICATE_PASSWORD"
              };
       }
       public IAsyncOperation<SAP.Logon.Core.CertificateData> GetStoredCertificateAsync() {
              return Task.FromResult<SAP.Logon.Core.CertificateData>(null).AsAsyncOperation<SAP.Logon.Core.CertificateData>();
       }
}