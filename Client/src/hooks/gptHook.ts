

export const sendMessageToServer = async (message: string) => {
    return await sendToServer("http://localhost:5000/api/send/text", "POST", message);
}

export const sendAudioToServer = async (audio: Blob) => {
    return await sendToServer("http://localhost:5000/api/send/voice", "POST", audio);
}

const sendToServer = async (url: string, method: string, data: string | Blob) => {
    const formData = new FormData();

    formData.append("content", data)

    const response = await fetch(url, {
        method: method,
        body: formData,
    });

    if(response.ok) {
        return await response.text();
    }
    else {
        return "Server error, please try sending your request later"
    }
}