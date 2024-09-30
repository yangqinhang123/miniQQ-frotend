import request from "@/util/request";

export interface UploadImageParamType {
  file: any;
}
export interface UploadImageResType {
  msg: string;
  url: string;
}
export interface SetUserAvatarParamType {
  /**头像url */
  avatar_url: string;
}
export const uploadImage = async (file: any) => {
  const formData = new FormData();
  formData.append("file", file);
  return request.postByForm<UploadImageResType, any>("/file/upload", formData, {
    noCancel: true,
    showTip: false,
  });
};

/**
 * 设置用户头像
 * @param avatar_url 头像url
 * @returns 
 */
export const setUserAvatarReq = async (avatar_url: string) => {
  return request.post<any, SetUserAvatarParamType>("/user/setUserAvatar", {
    avatar_url,
  });
};
