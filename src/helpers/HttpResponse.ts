export class HttpResponse {
  static paginate<Data>(
    data: Data,
    total: number,
    page: number,
    limit: number,
  ) {
    const response = {
      data: data,
      total: total,
      total_page: Math.ceil(total / limit),
      prev_page: page - 1 > 0 ? page - 1 : 0,
      current_page: page,
      next_page:
        page + 1 > Math.ceil(total / limit)
          ? Math.ceil(total / limit)
          : page + 1,
    };
    return {
      response,
      status: 200,
      message: null,
      name: null,
    };
  }

  static detail<Data>(data: Data) {
    return {
      response: data,
      status: 200,
      message: null,
      name: null,
    };
  }
}
