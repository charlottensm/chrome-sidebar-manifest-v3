export function attachHeadersListener({
  webRequest,
  hosts,
  iframeHosts,
  overrideFrameOptions,
}) {
  if (typeof hosts !== "string") {
    if (hosts) {
      hosts = hosts.join(" ");
    } else {
      throw new Error("`hosts` option must be a string or array");
    }
  }

  if (typeof iframeHosts !== "string") {
    if (iframeHosts) {
      iframeHosts = iframeHosts.join(" ");
    } else {
      throw new Error("`iframeHosts` option must be a string or array");
    }
  }

  const types = ["main_frame"];

  if (overrideFrameOptions) {
    types.push("sub_frame");
  }

  function stripHeaders(headers) {
    return headers.filter((header) => {
      let headerName = header.name.toLowerCase();
      return !(
        headerName === "content-security-policy" ||
        headerName === "x-frame-options" ||
        headerName === "permissions-policy" ||
        headerName === "x-xss-protection" ||
        headerName === "x-content-type-options" ||
        headerName === "strict-transport-security" ||
        headerName === "expect-ct" ||
        headerName === "expires" ||
        headerName === "cache-control" ||
        headerName === "pragma" ||
        headerName == "cf-cache-status" ||
        headerName == "cf-ray" ||
        headerName == "cf-request-id" ||
        headerName === "content-ecoding"
      );
    });
  }

  webRequest.onHeadersReceived.addListener(
    function (details) {
      console.log(stripHeaders(details.responseHeaders));
      return {
        responseHeaders: stripHeaders(details.responseHeaders),
      };
      if (overrideFrameOptions) {
        csp = csp.replace(/frame-ancestors (.*?);/gi, "");
      }
    },
    {
      urls: ["<all_urls>"],
    },
    ["blocking", "responseHeaders", "extraHeaders"]
  );

  // webRequest.onHeadersReceived.addListener(details => {
  //   const responseHeaders = details.responseHeaders.map(header => {
  //     const isCSPHeader = /content-security-policy/i.test(header.name)
  //     const isFrameHeader = /x-frame-options/i.test(header.name)

  //     if (isCSPHeader) {
  //       let csp = header.value

  //       csp = csp.replace('script-src', `script-src ${hosts}`)
  //       csp = csp.replace('style-src', `style-src ${hosts}`)
  //       csp = csp.replace('frame-src', `frame-src ${iframeHosts}`)
  //       csp = csp.replace('child-src', `child-src ${hosts}`)

  //       if (overrideFrameOptions) {
  //         csp = csp.replace(/frame-ancestors (.*?);/ig, '')
  //       }

  //       header.value = csp
  //     } else if (isFrameHeader && overrideFrameOptions) {
  //       header.value = 'ALLOWALL'
  //     }

  //     return header
  //   })

  //   return { responseHeaders }
  // }, {
  //   urls: ["<all-urls>"],
  //   types
  // }, [
  //   'blocking',
  //   'responseHeaders'
  // ])
}

export default {
  attachHeadersListener,
};
