import axios, {AxiosInstance, AxiosResponse} from "axios";

const onResponse = async (response: AxiosResponse): Promise<AxiosResponse> => {
    if (response.status === 202) {

        console.log("HTTP 202 received, polling operation...");
        console.log("Operation running at " + response.headers.location);

        // Retrieve the initial operation status
        let pollingResponse = await axios.get(response.headers.location);

        console.log("Operation status is " + pollingResponse.data.status);

        // Loop while the operation is still in progress...
        while (pollingResponse.data.status !== "Succeeded" && pollingResponse.data.status !== "Failed") {


            pollingResponse = await axios.get(response.headers.location);

            console.log("Operation status is " + pollingResponse.data.status);

        }

        if (pollingResponse.data.status === "Failed") {
            // Treat failures as exceptions, so they can be handled as such
            throw 'Operation failed!';
        } else {

            console.log("Operation succeeded!");
            console.log("Retrieving resource at " + pollingResponse.data.resourceLocation);

            // Once operation succeeded, return response from final resource location
            return await axios.get(pollingResponse.data.resourceLocation);
        }
    }

    // If not a 202 response, then return as normal
    return response;
}

export function setupInterceptorsTo(axiosInstance: AxiosInstance): AxiosInstance {
    axiosInstance.interceptors.response.use(onResponse);
    return axiosInstance;
}
