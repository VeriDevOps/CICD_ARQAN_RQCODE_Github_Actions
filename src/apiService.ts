import axios from 'axios'

namespace ApiService {
  export async function getSecuritySentences(requirement: string) {
    const response = await axios.post('http://51.178.12.108:8000/text', requirement, {
      headers: { 'Content-type': 'text/plain;' }
    })
    return response.data
  }

  export async function getRecommendedStigs(requirement: string): Promise<string[]> {
    // TODO: Make actual API call when API will be ready
    // fake api response
    return ['https://www.stigviewer.com/stig/canonical_ubuntu_16.04_lts/2020-12-09/finding/V-214961']
  }
}

export default ApiService
