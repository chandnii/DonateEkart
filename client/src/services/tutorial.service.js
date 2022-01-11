import http from "../http-common";

class TutorialDataService {
  getAll() {
    return http.get("/getall");
  }

  getCurrency() {
    return http.get("getCurrency");
  }

  get(id) {
    return http.get(`/ekart/find`);
  }

  create(data) {
    return http.post("/ekart", data);
  }

  update(id, data) {
    return http.put(`/ekart/${id}`, data);
  }

  delete(id) {
    return http.delete(`/ekart/${id}`);
  }

  deleteAll() {
    return http.delete(`/ekart`);
  }

  findByTitle(title) {
    return http.get(`/ekart?title=${title}`);
  }
}

export default new TutorialDataService();
