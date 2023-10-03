export const deletetask = async (data: any,token:string) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const raw = JSON.stringify({
        id:data,
    });

    const requestOptions: any = {
        method: 'DELETE',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_DELETE_TASK}`, requestOptions);
    const resposeData = await response.json();
    return resposeData
};