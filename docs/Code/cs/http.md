```cs

   string result;
            using (Stream stream = HttpContext.Current.Request.InputStream)
            {
                if (stream == null)
                    result = string.Empty;
                using (var reader = new StreamReader(stream, Encoding.UTF8))
                {
                    result = reader.ReadToEnd();
                }
            }




            try
            {
                int lang = HttpContext.Current.Request.TotalBytes;
                byte[] bytes = HttpContext.Current.Request.BinaryRead(lang);
                string content = Encoding.UTF8.GetString(bytes);

                //方法二
                var stream2 = HttpContext.Current.Request.InputStream;

                var resp = new StreamReader(stream2, Encoding.GetEncoding("utf-8")).ReadToEnd();
                resp = new StreamReader(stream2).ReadToEnd();
            }
            catch (Exception ex)
            {

                throw ex;
            }
			
			
			
			
			
			
			            string postData = "{\"userid\": \"" + 1 + "\",\"agentid\": \"1\"}";
            byte[] byteArray = Encoding.UTF8.GetBytes(postData);
            HttpWebRequest webRequest = (HttpWebRequest)WebRequest.Create(new Uri(url));
            webRequest.Method = "post";
            webRequest.ContentType = "application/x-www-form-urlencoded";
            webRequest.ContentLength = byteArray.Length;
            System.IO.Stream newStream = webRequest.GetRequestStream();
            newStream.Write(byteArray, 0, byteArray.Length);
            newStream.Close();
            HttpWebResponse response = (HttpWebResponse)webRequest.GetResponse();
            data = new System.IO.StreamReader(response.GetResponseStream(), Encoding.GetEncoding("utf-8")).ReadToEnd();
```