export function bbsNotifEmailHtml({
  threadTitle,
  inputValue,
  threadUrl,
  senderAvatarUrl,
}: {
  threadTitle: string;
  inputValue: string;
  threadUrl: string;
  senderAvatarUrl: string;
}): string {
  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html data-editor-version="2" class="sg-campaigns" xmlns="http://www.w3.org/1999/xhtml">

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
  <!--[if !mso]><!-->
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <!--<![endif]-->
  <!--[if (gte mso 9)|(IE)]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
  <!--[if (gte mso 9)|(IE)]>
  <style type="text/css">
    body {width: 600px;margin: 0 auto;}
    table {border-collapse: collapse;}
    table, td {mso-table-lspace: 0pt;mso-table-rspace: 0pt;}
    img {-ms-interpolation-mode: bicubic;}
  </style>
<![endif]-->
  <style type="text/css">
    body,
    p,
    div {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', 'Hiragino Kaku Gothic ProN', 'Hiragino Sans', 'Meiryo', sans-serif;
      font-size: 14px;
    }

    body {
      color: #000000;
    }

    body a {
      color: #1188E6;
      text-decoration: none;
    }

    p {
      margin: 0;
      padding: 0;
    }

    table.wrapper {
      width: 100% !important;
      table-layout: fixed;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -moz-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }

    img.max-width {
      max-width: 100% !important;
    }

    .column.of-2 {
      width: 50%;
    }

    .column.of-3 {
      width: 33.333%;
    }

    .column.of-4 {
      width: 25%;
    }

    ul ul ul ul {
      list-style-type: disc !important;
    }

    ol ol {
      list-style-type: lower-roman !important;
    }

    ol ol ol {
      list-style-type: lower-latin !important;
    }

    ol ol ol ol {
      list-style-type: decimal !important;
    }

    @media screen and (max-width:480px) {

      .preheader .rightColumnContent,
      .footer .rightColumnContent {
        text-align: left !important;
      }

      .preheader .rightColumnContent div,
      .preheader .rightColumnContent span,
      .footer .rightColumnContent div,
      .footer .rightColumnContent span {
        text-align: left !important;
      }

      .preheader .rightColumnContent,
      .preheader .leftColumnContent {
        font-size: 80% !important;
        padding: 5px 0;
      }

      table.wrapper-mobile {
        width: 100% !important;
        table-layout: fixed;
      }

      img.max-width {
        height: auto !important;
        max-width: 100% !important;
      }

      a.bulletproof-button {
        display: block !important;
        width: auto !important;
        font-size: 80%;
        padding-left: 0 !important;
        padding-right: 0 !important;
      }

      .columns {
        width: 100% !important;
      }

      .column {
        display: block !important;
        width: 100% !important;
        padding-left: 0 !important;
        padding-right: 0 !important;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }

      .social-icon-column {
        display: inline-block !important;
      }
    }
  </style>
  <!--user entered Head Start-->
  <link href="https://fonts.googleapis.com/css?family=Fredoka+One&display=swap" rel="stylesheet">
  <style>

  </style><!--End Head user entered-->
</head>

<body>
  <center class="wrapper" data-link-color="#1188E6"
    data-body-style="font-size:14px; color:#000000; background-color:#e5dcd2;">
    <div class="webkit">
      <table cellpadding="0" cellspacing="0" border="0" width="100%" class="wrapper" bgcolor="#e5dcd2">
        <tr>
          <td valign="top" bgcolor="#111" width="100%">
            <table width="100%" role="content-container" class="outer" align="center" cellpadding="0" cellspacing="0"
              border="0">
              <tr>
                <td width="100%">
                  <table width="100%" cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td>
                        <!--[if mso]>
                          <center>
                          <table><tr><td width="600">
                        <![endif]-->
                        <table width="100%" cellpadding="0" cellspacing="0" border="0"
                          style="width:100%; max-width:600px;" align="center">
                          <tr>
                            <td role="modules-container"
                              style="padding:0px 0px 0px 0px; color:#000000; text-align:left;" bgcolor="#FFFFFF"
                              width="100%" align="left">
                              <table class="module preheader preheader-hide" role="module" data-type="preheader"
                                border="0" cellpadding="0" cellspacing="0" width="100%"
                                style="display: none !important;  visibility: hidden; opacity: 0; color: transparent; height: 0; width: 0;">
                                <tr>
                                  <td role="module-content">
                                    <p></p>
                                  </td>
                                </tr>
                              </table>
                              <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"
                                role="module" data-type="columns" style="padding:40px 30px 40px 30px;" bgcolor="#D23E3E"
                                data-distribution="1,1">
                                <tbody>
                                  <tr role="module-content">
                                    <td height="100%" valign="top">                                     
                                      <table width="270"
                                        style="width:270px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;"
                                        cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                        class="column column-1">
                                        <tbody>
                                          <tr>
                                            <td style="padding:0px;margin:0px;border-spacing:0;">
                                              <table class="module" role="module" data-type="text" border="0"
                                                cellpadding="0" cellspacing="0" width="100%"
                                                style="table-layout: fixed;"
                                                data-muid="ccce2c05-cf21-40f7-898f-299ac08e95c7"
                                                data-mc-module-version="2019-10-22">
                                                <tbody>
                                                  <tr>
                                                    <tdd style="padding:0px 0px 0px 5px; line-height:22px; text-align:inherit; height:100% valign:top role:module-content>
                                                      <div>
                                                        <div style="font-family: inherit; text-align: right">
                                                          <span style="color: #ffffff;font-weight:600">
                                                            STUDIO+
                                                          </span>
                                                        </div>
                                                      </div>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="wrapper" role="module" data-type="image" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="ed14edbd-d3e7-4bd9-bd3e-9c0820a20a0e">
                                <tbody>
                                  <tr>
                                    <td style="font-size:6px; line-height:10px; padding:0px 0px 0px 0px;" valign="top"
                                      align="center">
                                      <img class="max-width" border="0"
                                        style="display:block; color:#000000; text-decoration:none; font-family:Helvetica, arial, sans-serif; font-size:16px; max-width:100% !important; width:100%; height:auto !important;"
                                        width="600" alt="" data-proportionally-constrained="true" data-responsive="true"
                                        src="http://cdn.mcauto-images-production.sendgrid.net/954c252fedab403f/a05d7244-edf4-4820-9a42-c376545daa93/600x291.png">
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                              <table class="module" role="module" data-type="text" border="0" cellpadding="0"
                                cellspacing="0" width="100%" style="table-layout: fixed;"
                                data-muid="95da0398-7fbb-45e7-b0bd-f157d51435dd" data-mc-module-version="2019-10-22">
                                <tbody>
                                  <tr>
                                    <td style="padding:20px 30px 0px 30px; line-height:36px; text-align:inherit;" height="100%" valign="top" bgcolor="" role="module-content">
                                      <div>
                                        <div style="font-family: inherit; text-align: center">
                                          <span style="color: #199dff; font-size: 20px; font-weight:800">
                                            New message in this thread
                                          </span>
                                        </div>
                                        <div></div>
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>

                              <div class="container">
                                <div style="display: flex; flex-direction: column; margin-bottom: 20px; align-items: center;text-align: center;">
                                  <div style="font-size: 16px">
                                    ${threadTitle}
                                  </div>
                                </div>

                                <div style="display: flex; flex-direction: column; align-items: center; margin-bottom: 20px;">
                                  <img src="${senderAvatarUrl}" alt="Sender Avatar" style="width: 28px; height: 28px; border-radius: 50%; margin-bottom: 8px;"/>
                                  <div class="message" style="border: 1px solid; border-radius: 8px; padding: 8px; text-align: center;">
                                    ${inputValue}
                                  </div>
                                </div>
                              </div>

                              <div style="text-align: center;margin-bottom:20px">
                                <ul style="display: inline-block; text-align: left; padding-left: 1em; font-size: 14px; line-height: 1.8; margin: 0 auto;">
                                  <li>スレッドの所有者に送信されます</li>
                                  <li>通知設定がオンの場合のみ送信されます</li>
                                  <li>通知は24時間に1回だけ実行されます</li>
                                </ul>
                              </div>

                              <table border="0" cellpadding="0" cellspacing="0" align="center" width="100%"
                                role="module" data-type="columns" style="padding:0px 0px 0px 0px;" bgcolor="#D23E3E"
                                data-distribution="1,1">
                                <tbody>
                                  <tr role="module-content">
                                    <td height="100%" valign="top">
                                      <table width="300"
                                        style="width:300px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;"
                                        cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                        class="column column-0">
                                        <tbody>
                                          <tr>
                                            <td style="padding:0px;margin:0px;border-spacing:0;">
                                              <table border="0" cellpadding="0" cellspacing="0" class="module"
                                                data-role="module-button" data-type="button" role="module"
                                                style="table-layout:fixed;" width="100%"
                                                data-muid="08619d14-45ee-4dde-827c-7eb48956ed4e">
                                                <tbody>
                                                  <tr>
                                                    <td align="center" bgcolor="D23E3E" class="outer-td"
                                                      style="padding:20px 0px 20px 0px; background-color:D23E3E;">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                        class="wrapper-mobile" style="text-align:center;">
                                                        <tbody>
                                                          <tr>
                                                            <td align="center" bgcolor="#ffffff" class="inner-td"
                                                              style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit">
                                                              <a href=${threadUrl}
                                                                style="background-color:#ffffff; border:1px solid #ffffff; border-color:#ffffff; border-radius:0px; border-width:1px; color:#000000; display:inline-block; font-size:14px; font-weight:300; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid; width:240px; font-family:lucida sans unicode,lucida grande,sans-serif;"
                                                                target="_blank">
                                                                  スレッドを見る
                                                              </a>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table width="300"
                                        style="width:300px; border-spacing:0; border-collapse:collapse; margin:0px 0px 0px 0px;"
                                        cellpadding="0" cellspacing="0" align="left" border="0" bgcolor=""
                                        class="column column-1">
                                        <tbody>
                                          <tr>
                                            <td style="padding:0px;margin:0px;border-spacing:0;">
                                              <table border="0" cellpadding="0" cellspacing="0" class="module"
                                                data-role="module-button" data-type="button" role="module"
                                                style="table-layout:fixed;" width="100%"
                                                data-muid="08619d14-45ee-4dde-827c-7eb48956ed4e.1">
                                                <tbody>
                                                  <tr>
                                                    <td align="center" bgcolor="D23E3E" class="outer-td"
                                                      style="padding:20px 0px 20px 0px; background-color:D23E3E;">
                                                      <table border="0" cellpadding="0" cellspacing="0"
                                                        class="wrapper-mobile" style="text-align:center;">
                                                        <tbody>
                                                          <tr>
                                                            <td align="center" bgcolor="#ffffff" class="inner-td"
                                                              style="border-radius:6px; font-size:16px; text-align:center; background-color:inherit;">
                                                              <a href="#" style="background-color:#ffffff; border:1px solid #ffffff; border-color:#ffffff; border-radius:0px; border-width:1px; color:#000000; display:inline-block; font-size:14px; font-weight:300; letter-spacing:0px; line-height:normal; padding:12px 18px 12px 18px; text-align:center; text-decoration:none; border-style:solid; width:240px; font-family:lucida sans unicode,lucida grande,sans-serif;" target="_self">
                                                                -
                                                              </a>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </table>
                        <!--[if mso]>
                                  </td>
                                </tr>
                              </table>
                            </center>
                            <![endif]-->
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </center>
</body>

</html>
  `;
}
