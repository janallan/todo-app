export default {
  async store({commit}, formData){
    const response = await this.$axios.post('/task', formData)
    return response
  },

  async update({commit}, formData){
    const url = '/task/' + formData.id
    const response = await this.$axios.put(url, formData.data)
    return response
  },

  async delete({commit}, id){
    const url = '/task/' + id
    const response = await this.$axios.delete(url)
    return response
  },

  async completed({commit}, id){
    const url = '/task/completed/' + id
    const response = await this.$axios.post(url)
    return response
  },

  async incomplete({commit}, id){
    const url = '/task/incomplete/' + id
    const response = await this.$axios.post(url)
    return response
  },

  async archive({commit}, id){
    const url = '/task/archived/' + id
    const response = await this.$axios.post(url)
    return response
  },

  async restore({commit}, id){
    const url = '/task/restore/' + id
    const response = await this.$axios.post(url)
    return response
  },

  async availableTags({commit}, id){
    const url = '/task/' + id + '/tags/available'
    const response = await this.$axios.get(url)
    return response
  },

  async setTags({commit}, data){
    const url = '/task/' + data.id + '/tags'
    const response = await this.$axios.post(url, data)
    return response
  },

  async removeTag({commit}, data){
    const url = '/task/' + data.id + '/tags/remove/' + data.tag
    const response = await this.$axios.post(url)
    return response
  },

  async removeAttachment({commit}, data){
    const url = '/task/' + data.id + '/attachments/delete/' + data.attachment
    const response = await this.$axios.post(url)
    return response
  },

  async downloadAttachment({commit}, data){
    const url = '/task/' + data.id + '/attachments/download/' + data.attachment
    const response = await this.$axios.post(url)
    return response
  },


}
