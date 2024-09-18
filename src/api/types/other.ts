/**下载非同源的图片/视频，有效期5s，返回一个本机路径 - 请求参数  /api/other/download  */
export interface OtherDownloadReq {
    /**路径 */
    url: string
    /**其它可能需要的参数，将会放到body中 */
    params?: any
}