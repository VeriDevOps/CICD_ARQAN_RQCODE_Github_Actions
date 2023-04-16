import axios from 'axios'

namespace ApiService {

  export async function getToken(username: string, password: string) {
    console.log('Authenticating in ARQAN')
    const response = await axios.post(
        'http://51.250.88.251:8000/api/auth/sign-up',
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

  export async function getSecuritySentences(requirement: string, token: string) {
    console.log('Making call to ARQAN')
    let response = await axios.post('http://51.250.88.251:8000/api/tasks/sec-req-extract-from-text',
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

    response = await axios.get(`http://51.250.88.251:8000/api/tasks/sec-req-extract/${task_id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        })
    console.log(response.status)
    return response.data
  }

  export async function getRecommendedStigs(requirement: string, platform: string, token: string): Promise<Array<any>> {
    let response = await axios.post('http://51.250.88.251:8000/api/tasks/sec-req-search-db',
        {
          'text': requirement,
          'platform': platform
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

    const task_id = response.data.task_id

    response = await axios.get(`http://51.250.88.251:8000/api/tasks/sec-req-search-db/${task_id}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'accept': 'application/json'
          }
        })

    console.log(response.status)
    return response.data.stig
  }
}

export default ApiService
