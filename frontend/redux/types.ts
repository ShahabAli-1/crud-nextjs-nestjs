export interface IService {
  _id: string
  name: string
  description: string
  price: number
  createdAt: string
  updatedAt: string
  __v: number
}

export interface IPackageServiceInput {
  service: string // Service ID
  quantity: number
}

export interface IPackageInput {
  name: string
  description: string
  services: IPackageServiceInput[]
}

export interface IPackageService {
  service: IService
  quantity: number
}

export interface IPackage {
  _id: string
  name: string
  description: string
  services: IPackageService[]
  createdAt: string
  updatedAt: string
  __v: number
}
