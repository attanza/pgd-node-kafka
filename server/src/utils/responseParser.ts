import { Response } from 'express';
export const responseCollection = (
  res: Response,
  resourceName: string,
  data: any
) => {
  const output = {
    meta: {
      status: 200,
      message: `${resourceName} Collection`,
    },
    data,
  };
  return res.status(200).json(output);
};

export const responseDetail = (
  res: Response,
  resourceName: string,
  data: any
) => {
  const output = {
    meta: {
      status: 200,
      message: `${resourceName} Detail`,
    },
    data,
  };
  return res.status(200).json(output);
};

export const responseCreate = (
  res: Response,
  resourceName: string,
  data: any
) => {
  const output = {
    meta: {
      status: 201,
      message: `${resourceName} Created`,
    },
    data,
  };
  return res.status(201).json(output);
};
export const responseUpdate = (
  res: Response,
  resourceName: string,
  data: any
) => {
  const output = {
    meta: {
      status: 200,
      message: `${resourceName} Updated`,
    },
    data,
  };
  return res.status(200).json(output);
};

export const responseDelete = (res: Response, resourceName: string) => {
  const output = {
    meta: {
      status: 200,
      message: `${resourceName} Deleted`,
    },
  };
  return res.status(200).json(output);
};

export const responseSuccess = (
  res: Response,
  message: string,
  data: any = undefined
) => {
  const output = {
    meta: {
      status: 200,
      message,
    },
    data,
  };
  return res.status(200).json(output);
};

export const responseError = (
  res: Response,
  status: number = 500,
  message: string = 'Internal server error'
) => {
  const output = {
    meta: {
      status,
      message,
    },
  };
  return res.status(status).json(output);
};
