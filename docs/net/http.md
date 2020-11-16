```cs
public static string Test()
{
    string url = "http://127.0.0.1:4433";

    string requestXML = WithParams();
    requestXML = "requestXML=" + requestXML;

    HttpWebRequest webRequest = (HttpWebRequest)HttpWebRequest.Create(url);
    webRequest.Method = "POST";

    webRequest.ContentType = "application/x-www-form-urlencoded;charset=GBK";
    webRequest.ContentLength = requestXML.Length;
    //webRequest.KeepAlive = false;

    var s = webRequest.GetRequestStream();

  

    var param = Encoding.GetEncoding("GB18030").GetBytes(requestXML);
    s.Write(param, 0, param.Length);
    s.Flush();
    s.Close();

    using (WebResponse webResponse = webRequest.GetResponse())
    {
        var sr = new StreamReader(webResponse.GetResponseStream(), Encoding.GetEncoding("GB18030"));
        var responseData = sr.ReadToEnd();
        return responseData;
    }
}


  ServicePointManager.Expect100Continue = true;
  ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls;   //协议按需选择， 
  //ServicePointManager.ServerCertificateValidationCallback = (object sender, X509Certificate certificate, X509Chain chain, SslPolicyErrors sslPolicyErrors) => { return true; };

////查找我们导入的证书
X509Store certStore = new X509Store(StoreName.My, StoreLocation.LocalMachine);
certStore.Open(OpenFlags.ReadOnly);
X509Certificate2Collection certCollection = certStore.Certificates.Find(X509FindType.FindBySubjectName, "W00099427", false);
webRequest.ClientCertificates=  certCollection;

string certificate = "cer/ie.cer";

X509Certificate2 certificates = new X509Certificate2();
certificates.Import(certificate, "2156532", X509KeyStorageFlags.DefaultKeySet);

webRequest.ClientCertificates = new X509CertificateCollection() { certificates };

  request.AddHeader("Content-Length", ("reqDataXML=" + reqDataXML).Length.ToString());
  request.AddHeader("Connection", "close");


```