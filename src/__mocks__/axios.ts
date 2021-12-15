import { AxiosStatic } from 'axios'

const axios = jest.genMockFromModule<AxiosStatic>('axios')

axios.create = jest.fn(() => axios)

export default axios
