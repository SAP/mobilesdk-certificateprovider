using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Security.Cryptography.Certificates;
using Windows.Storage;
using Windows.Storage.Streams;

namespace CertProviderWRC
{
    public sealed class FileCertificateProvider : SAP.CertificateProvider.ICertificateProvider
    {

        private Certificate certificate = null;

        private string certificateFolder = "assets";
        private string certificateFile = "Marvin.p12";
        private string certificatePassword = "1234";

        public IAsyncAction InitializeAsync()
        {

            System.Diagnostics.Debug.WriteLine("CertificateProvider - InitializeAsync called");

            return this.ImportCertificateHelperAsync(certificateFolder, certificateFile).AsAsyncAction();

        }

        public IAsyncAction DeleteStoredCertificateAsync()
        {
            System.Diagnostics.Debug.WriteLine("CertificateProvider - DeleteStoredCertificateAsync called");

            return Task.Run(() => { this.certificate = null; }).AsAsyncAction();
        }

        public Certificate GetCertificate()
        {
            System.Diagnostics.Debug.WriteLine("CertificateProvider - GetCertificate called");

            return this.certificate;
        }

        /*
        * Private Helper method
        * will import certificate into App's key store
        */
        private async Task<Certificate> ImportCertificateHelperAsync(string certFolder, string certFileName)
        {
            StorageFolder packageLocation = Windows.ApplicationModel.Package.Current.InstalledLocation;
            StorageFolder certificateFolder = await packageLocation.GetFolderAsync(certFolder);
            StorageFile certificate = await certificateFolder.GetFileAsync(certFileName);

            IBuffer buffer = await Windows.Storage.FileIO.ReadBufferAsync(certificate);
            string encodedString = Windows.Security.Cryptography.CryptographicBuffer.EncodeToBase64String(buffer);

            System.Diagnostics.Debug.WriteLine("Encoded Certificate: " + encodedString);

            await CertificateEnrollmentManager.ImportPfxDataAsync(
                            encodedString,
                            certificatePassword,
                            ExportOption.NotExportable,
                            KeyProtectionLevel.NoConsent,
                            InstallOptions.DeleteExpired,
                            "userCert");

            IReadOnlyList<Windows.Security.Cryptography.Certificates.Certificate> certs = await Windows.Security.Cryptography.Certificates.CertificateStores.FindAllAsync(new Windows.Security.Cryptography.Certificates.CertificateQuery() { FriendlyName = "userCert" });
            this.certificate = certs.FirstOrDefault();

            System.Diagnostics.Debug.WriteLine("Certificate ready for user (CN): " + this.certificate.Subject);

            return certs.FirstOrDefault();
        }

    }
}
