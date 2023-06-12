import axios from 'axios'

namespace ApiService {
    const interval = 1000; // set polling interval to 1 second
    const timeout  = 120000;
    export async function getToken(url: string, username: string, password: string) {
        console.log('Authenticating in ARQAN')
        const response = await axios.post(
            `${url}/auth/sign-up`,
            `username=${username}&password=${password}`,
            {
                headers: {
                    'Content-type': 'application/x-www-form-urlencoded',
                    'accept': 'application/json'
                }
            }
        )
        return response.data.access_token

    }
    export async function getSecuritySentences(url: string, requirement: string, token: string) {
        console.log('Making call to ARQAN')
        let response = await axios.post(`${url}/tasks/sec-req-extract-from-text`,
            {
                'requirements': requirement
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        const task_id = response.data.task_id
        console.log("Task id: ", task_id)

        response = await axios.get(`${url}/tasks/${task_id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json'
            }
        });
        const startTime = new Date().getTime();
        while (response.status === 202 && new Date().getTime() - startTime < timeout) {
            await new Promise(resolve => setTimeout(resolve, interval)); // Wait for interval before making another request
            response = await axios.get(`${url}/tasks/${task_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json'
                }
            });
        }
        if (response.status === 202) {
            throw new Error('Polling timed out. Probably ARQAN is down.');
        }

        return response.data
    }

    export async function getRecommendedStigs(url: string, requirement: string, platform: string, limit: number, token: string): Promise<Array<any>> {
        let response = await axios.post(`${url}/tasks/sec-req-search-db`,
            {
                'text': requirement,
                'platform': platform,
                'limit': limit
            },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

        const task_id = response.data.task_id

        response = await axios.get(`${url}/tasks/sec-req-search-db/${task_id}`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json'
                }
            })

        const interval = 1000; // set polling interval to 1 second
        const startTime = new Date().getTime();
        while (response.status === 202 && new Date().getTime() - startTime < timeout) {
            await new Promise(resolve => setTimeout(resolve, interval)); // Wait for interval before making another request
            response = await axios.get(`${url}/tasks/sec-req-extract/${task_id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'accept': 'application/json'
                }
            });
        }

        if (response.status === 202) {
            throw new Error('Polling timed out');
        }

        return response.data.stig
    }
}

export default ApiService
