export default {
  setLocalStorageData(key: string, payload: string){
    localStorage.setItem(key, payload);
  },
  getLocalStorageData(key: string) {
    return localStorage.getItem(key);
  },
  deleteLocalStorageData(key :string){
    return localStorage.removeItem(key)
  }
}
