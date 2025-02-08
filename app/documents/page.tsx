import { FileUploader } from '../FileUploader';



export default async function Documents() {

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold  mb-8">Mes documents</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div>
          <FileUploader />
        </div>
      </div>
    </div>
  );
}