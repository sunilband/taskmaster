export const sendrecovery = async (data: any) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
        ...data,
    });

    const requestOptions: any = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_SEND_RECOVERY}`, requestOptions);
    const resposeData = await response.json();
    return resposeData
};