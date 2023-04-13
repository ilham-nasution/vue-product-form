export default interface Form {
  id?: number;
  created_at?: Date;
  label?: string;
  type?: number;
  form_types?: FormTypes;
}

interface FormTypes {
  name: string;
}
