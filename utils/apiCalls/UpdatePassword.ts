export const updatepassword = async (data: any) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const raw = JSON.stringify({
        ...data,
    });

    const requestOptions: any = {
        method: 'PUT',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_UPDATE_PASSWORD}`, requestOptions);
    const resposeData = await response.json();
    return resposeData
};