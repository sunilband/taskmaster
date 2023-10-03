// export const getuser = async (data: any) => {
//     const myHeaders = new Headers();
//     myHeaders.append('Content-Type', 'application/json');

//     const raw = JSON.stringify({
//         ...data,
//     });

//     const requestOptions: any = {
//         method: 'POST',
//         headers: myHeaders,
//         body: raw,
//         redirect: 'follow',
//     };

//     const response = await fetch(`${process.env.NEXT_PUBLIC_GET_USER}`, requestOptions);
//     const resposeData = await response.json();
//     return resposeData
// };

import { toast } from 'react-toastify';

export const gettasks = async (token: string) => {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    myHeaders.append('Authorization', `Bearer ${token}`);

    const requestOptions: any = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
    };

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_GET_TASKS}`, requestOptions);
        const responseData = await response.json();
        return responseData
    } catch (err: any) {
    console.log(err)
    }
};