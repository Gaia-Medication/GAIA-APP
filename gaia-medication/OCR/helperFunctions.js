
const API_KEY = 'AIzaSyBaE8EbvLJSecjKYRLVHXsxA4LqPjwJiVo'; //put your key here.
//this endpoint will tell Google to use the Vision API. We are passing in our key as well.
const API_URL = `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`;
function generateBody(image) {
  const body = {
    requests: [
      {
        image: {
          content: image,
        },
        features: [
          {
            type: 'TEXT_DETECTION', //we will use this API for text detection purposes.
            maxResults: 1,
          },
        ],
      },
    ],
  };
  return body;
}

async function callGoogleVisionAsync(image) {
    const body = generateBody(image);
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const result = await response.json();
    console.log(result);
    const detectedText = result.responses[0].fullTextAnnotation;
    return detectedText
      ? detectedText
      : { text: "This image doesn't contain any text!" };
  }
  export default callGoogleVisionAsync;