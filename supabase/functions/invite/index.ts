import { serve } from "std/server"
import {LogSnag} from "logsnag"

const logsnag = new LogSnag({ 
  token: Deno.env.get('logsnagtoken') ?? '',
  project: Deno.env.get('logsnagproject') ?? ''
});

serve(async (req) => {
  const tablechange = await req.json()
  console.log(tablechange.record.invited);
  if (tablechange.record.invited == true) {
    console.log(tablechange.record.referID,"record.invite is true")
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${ Deno.env.get('RESEND_API_KEY') }`
        },
        body: JSON.stringify({
            from: 'Josh <josh@invites.magicrules.ai>',
            to: [tablechange.record.email],
            subject: "Invite to Magic AI!",
            html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
            
            <head>
              <!--[if gte mso 9]>
            <xml>
              <o:OfficeDocumentSettings>
                <o:AllowPNG/>
                <o:PixelsPerInch>96</o:PixelsPerInch>
              </o:OfficeDocumentSettings>
            </xml>
            <![endif]-->
              <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <meta name="x-apple-disable-message-reformatting">
              <!--[if !mso]><!-->
              <meta http-equiv="X-UA-Compatible" content="IE=edge">
              <!--<![endif]-->
              <title></title>
            
              <style type="text/css">
                @media only screen and (min-width: 520px) {
                  .u-row {
                    width: 500px !important;
                  }
                  .u-row .u-col {
                    vertical-align: top;
                  }
                  .u-row .u-col-33p33 {
                    width: 166.65px !important;
                  }
                  .u-row .u-col-50 {
                    width: 250px !important;
                  }
                  .u-row .u-col-100 {
                    width: 500px !important;
                  }
                }
                
                @media (max-width: 520px) {
                  .u-row-container {
                    max-width: 100% !important;
                    padding-left: 0px !important;
                    padding-right: 0px !important;
                  }
                  .u-row .u-col {
                    min-width: 320px !important;
                    max-width: 100% !important;
                    display: block !important;
                  }
                  .u-row {
                    width: 100% !important;
                  }
                  .u-col {
                    width: 100% !important;
                  }
                  .u-col>div {
                    margin: 0 auto;
                  }
                }
                
                body {
                  margin: 0;
                  padding: 0;
                }
                
                table,
                tr,
                td {
                  vertical-align: top;
                  border-collapse: collapse;
                }
                
                p {
                  margin: 0;
                }
                
                .ie-container table,
                .mso-container table {
                  table-layout: fixed;
                }
                
                * {
                  line-height: inherit;
                }
                
                a[x-apple-data-detectors='true'] {
                  color: inherit !important;
                  text-decoration: none !important;
                }
                
                table,
                td {
                  color: #ffffff;
                }
                
                #u_body a {
                  color: #3ed7ee;
                  text-decoration: underline;
                }
              </style>
            
            
            
            </head>
            
            <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #191919;color: #ffffff">
              <!--[if IE]><div class="ie-container"><![endif]-->
              <!--[if mso]><div class="mso-container"><![endif]-->
              <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #191919;width:100%" cellpadding="0" cellspacing="0">
                <tbody>
                  <tr style="vertical-align: top">
                    <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                      <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #191919;"><![endif]-->
            
            
            
                      <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                          <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
            
                            <!--[if (mso)|(IE)]><td align="center" width="500" style="width: 500px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
                            <div class="u-col u-col-100" style="max-width: 320px;min-width: 500px;display: table-cell;vertical-align: top;">
                              <div style="height: 100%;width: 100% !important;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;">
                                  <!--<![endif]-->
            
                                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:15px;font-family:arial,helvetica,sans-serif;" align="left">
            
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                              <td style="padding-right: 0px;padding-left: 0px;" align="center">
                                                <a href="https://magicrules.ai" target="_blank">
                                                  <img align="center" border="0" src="https://tzrsrwethpgxfeukzgkw.supabase.co/storage/v1/object/public/email%20resources/logo" alt="" title="" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 100%;max-width: 470px;"
                                                    width="470" />
                                                </a>
                                              </td>
                                            </tr>
                                          </table>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
            
                                          <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 22px; font-weight: 400;">Clear, trustworthy MTG rules in your pocket.</h1>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
            
                                          <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 40px; font-weight: 700;">You are invited!</h1>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
            
                                          <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                                          <div align="center">
                                            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://app.magicrules.ai" style="height:43px; v-text-anchor:middle; width:99px;" arcsize="9.5%"  stroke="f" fillcolor="#002cb8"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
                                            <a href="https://app.magicrules.ai" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #002cb8; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 19px;">
                                              <span style="display:block;padding:10px 20px;line-height:120%;"><span style="line-height: 22.8px;">Signup</span></span>
                                            </a>
                                            <!--[if mso]></center></v:roundrect><![endif]-->
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
            
                                          <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="line-height: 140%;">&nbsp;</p>
                                            <p style="line-height: 140%;">Hey there,</p>
                                            <p style="line-height: 140%;">&nbsp;</p>
                                            <p style="line-height: 140%;">Thanks for your interest in Magic AI! You can now signup with this email address or Login with Google with this email address at <a title="" target="_blank" href="https://app.magicrules.ai" rel="noopener">app.magicrules.ai</a>.</p>
                                            <p style="line-height: 140%;">&nbsp;</p>
                                            <p style="line-height: 140%;">I've been working on this idea since the start of 2023 and progress has been slow. Though, I am optimistic of the state of the project and it is time to hear some real word feedback.</p>
                                            <p style="line-height: 140%;">&nbsp;</p>
                                            <p style="line-height: 140%;">That is wear you come in. You will have trial credits in your account you can use for free. I want to hear about your experience and use this feedback to improve! I know Magic AI isn't yet perfect and it will get things wrong sometimes. The next thing on the roadmap is to make this feedback easy,
                                              right inside of Magic AI. For now shoot me a message on <a title="" target="_blank" href="https://twitter.com/magic_tcg_ai" rel="noopener">Twitter</a> or send an email to <a title="" target="_blank" href="mailto:feedback@mtgrules.ai?subject=Feedback"
                                                rel="noopener">feedback@mtgrules.ai</a>.</p>
                                            <p style="line-height: 140%;">&nbsp;</p>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
            
                                          <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 1px solid #BBBBBB;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                            <tbody>
                                              <tr style="vertical-align: top">
                                                <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                                                  <span>&#160;</span>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
            
                                          <h1 style="margin: 0px; line-height: 140%; text-align: center; word-wrap: break-word; font-size: 22px; font-weight: 400;">Demo</h1>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
            
                                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                                            <tr>
                                              <td style="padding-right: 0px; padding-left: 0px;" align="center">
                                                <a href="https://youtu.be/5ymkmX0rPHc" target="_blank">
                                                  <img align="center" border="0" src="https://tzrsrwethpgxfeukzgkw.supabase.co/storage/v1/object/public/email%20resources/demo-vid-thumbnail" alt="Video" title="Video" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;width: 100%;max-width: 480px;"
                                                    width="480" class="fullwidth" />
                                                </a>
                                              </td>
                                            </tr>
                                          </table>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div>
                                <!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                          </div>
                        </div>
                      </div>
            
            
            
            
            
                      <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                          <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
            
                            <!--[if (mso)|(IE)]><td align="center" width="250" style="width: 250px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-50" style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                              <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                  <!--<![endif]-->
            
                                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
            
                                          <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="line-height: 140%;">&nbsp;</p>
                                            <p style="line-height: 140%;">Thanks again and talk soon,</p>
                                            <p style="line-height: 140%;">Josh</p>
                                            <p style="line-height: 140%;">&nbsp;</p>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div>
                                <!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="250" style="width: 250px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-50" style="max-width: 320px;min-width: 250px;display: table-cell;vertical-align: top;">
                              <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                  <!--<![endif]-->
            
                                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
            
                                          <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
                                          <div align="center">
                                            <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://app.magicrules.ai" style="height:43px; v-text-anchor:middle; width:99px;" arcsize="9.5%"  stroke="f" fillcolor="#002cb8"><w:anchorlock/><center style="color:#FFFFFF;"><![endif]-->
                                            <a href="https://app.magicrules.ai" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #002cb8; border-radius: 4px;-webkit-border-radius: 4px; -moz-border-radius: 4px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 19px;">
                                              <span style="display:block;padding:10px 20px;line-height:120%;"><span style="line-height: 22.8px;">Signup</span></span>
                                            </a>
                                            <!--[if mso]></center></v:roundrect><![endif]-->
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div>
                                <!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                          </div>
                        </div>
                      </div>
            
            
            
            
            
                      <div class="u-row-container" style="padding: 0px;background-color: transparent">
                        <div class="u-row" style="margin: 0 auto;min-width: 320px;max-width: 500px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: transparent;">
                          <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
                            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:500px;"><tr style="background-color: transparent;"><![endif]-->
            
                            <!--[if (mso)|(IE)]><td align="center" width="166" style="width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
                              <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                  <!--<![endif]-->
            
                                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
            
                                          <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="line-height: 140%;">@2023 Cardboard AI Inc.</p>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div>
                                <!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="166" style="width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
                              <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                  <!--<![endif]-->
            
                                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
            
                                          <div style="font-size: 14px; line-height: 140%; text-align: left; word-wrap: break-word;">
                                            <p style="line-height: 140%;">
                                              <a title="" target="_blank" href="https://magicrules.ai" rel="noopener">magicrules.ai</a></p>
                                            <p style="line-height: 140%;"><a title="" target="_blank" href="https://magicrules.ai/privacy-policy" rel="noopener">Privacy Policy</a></p>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div>
                                <!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]><td align="center" width="166" style="width: 166px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
                            <div class="u-col u-col-33p33" style="max-width: 320px;min-width: 166.67px;display: table-cell;vertical-align: top;">
                              <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                <!--[if (!mso)&(!IE)]><!-->
                                <div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
                                  <!--<![endif]-->
            
                                  <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
                                    <tbody>
                                      <tr>
                                        <td style="overflow-wrap:break-word;word-break:break-word;padding:10px;font-family:arial,helvetica,sans-serif;" align="left">
            
                                          <div align="right">
                                            <div style="display: table; max-width:36px;">
                                              <!--[if (mso)|(IE)]><table width="36" cellpadding="0" cellspacing="0" border="0"><tr><td style="border-collapse:collapse;" align="right"><table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse; mso-table-lspace: 0pt;mso-table-rspace: 0pt; width:36px;"><tr><![endif]-->
            
            
                                              <!--[if (mso)|(IE)]><td width="32" style="width:32px; padding-right: 0px;" valign="top"><![endif]-->
                                              <table align="left" border="0" cellspacing="0" cellpadding="0" width="32" height="32" style="width: 32px !important;height: 32px !important;display: inline-block;border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;margin-right: 0px">
                                                <tbody>
                                                  <tr style="vertical-align: top">
                                                    <td align="left" valign="middle" style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
                                                      <a href="https://twitter.com/magic_tcg_ai" title="Twitter" target="_blank">
                                                        <img src="https://tzrsrwethpgxfeukzgkw.supabase.co/storage/v1/object/public/email%20resources/image-2.png" alt="Twitter" title="Twitter" width="32" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: block !important;border: none;height: auto;float: none;max-width: 32px !important">
                                                      </a>
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                              <!--[if (mso)|(IE)]></td><![endif]-->
            
            
                                              <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                                            </div>
                                          </div>
            
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
            
                                  <!--[if (!mso)&(!IE)]><!-->
                                </div>
                                <!--<![endif]-->
                              </div>
                            </div>
                            <!--[if (mso)|(IE)]></td><![endif]-->
                            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
                          </div>
                        </div>
                      </div>
            
            
            
                      <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
                    </td>
                  </tr>
                </tbody>
              </table>
              <!--[if mso]></div><![endif]-->
              <!--[if IE]></div><![endif]-->
            </body>
            
            </html>`,
        })
    });
    const resenddata = await res.json();
    
    if (res.ok) {
        console.log("email sent");
        await logsnag.publish({
          channel: "waitlist",
          event: "User Invited",
          icon: "✉️",
          tags: {
            referid: tablechange.record.referID,
          },
          notify: false
        })
        return new Response(resenddata, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } else {
      console.log(tablechange.record.referID, "res was not okay", resenddata)
      return new Response(resenddata, {
        status: 500,
        headers: {
            'Content-Type': 'application/json',
        },
    });
    }
  }
  return new Response(
    JSON.stringify(200),
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
