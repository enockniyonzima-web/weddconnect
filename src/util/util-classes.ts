/* eslint-disable @typescript-eslint/no-explicit-any */
export class DataInputs {
  private data: Record<string, any> = {};

     set(field: string, value: any, fieldType: string): void {
          switch (fieldType.toLowerCase()) {
               case "string":
                    this.data[field] = String(value);
                    break;
               case "number":
                    this.data[field] = Number(value);
                    break;
               case "boolean":
                    this.data[field] = value === "true" || value === true;
                    break;
               case "object":
                    try {
                         this.data[field] = JSON.parse(value);
                    } catch {
                         this.data[field] = value;
                    }
                    break;
               default:
                    this.data[field] = value;
          }
     }

     get<T>(field: string, defaultValue: T): T {
          return (this.data[field] !== undefined ? this.data[field] : defaultValue) as T;
     }

     toString():void {
          console.log(Object.entries(this.data).map(([key, value]) => `${key}: ${value} `))
     }

     checkFieldsIn(fields: string[]): { status: boolean; message: string } {
          const fieldsNotIn: string[] = [];
          
          fields.forEach(field => {
               if (!(field in this.data)) {
                    fieldsNotIn.push(field);
               }
          });
     
          if (fieldsNotIn.length > 0) {
               return { status: false, message: `Please fill in these fields: ${fieldsNotIn.join(", ")}` };
          }
          
          return { status: true, message: "All required fields are present." };
     }
}