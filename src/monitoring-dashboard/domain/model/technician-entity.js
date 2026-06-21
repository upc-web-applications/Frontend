export class Technician {
  constructor({
    id = null,
    code = '',
    firstName = '',
    lastName = '',
    fullName = '',
    specialty = '',
    email = '',
    phone = '',
    status = ''
  }) {
    this.id = id
    this.code = code
    this.firstName = firstName
    this.lastName = lastName
    this.fullName = fullName
    this.specialty = specialty
    this.email = email
    this.phone = phone
    this.status = status
  }
}
