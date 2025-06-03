import imgNotFound2 from "../../../assets/NotFoundImg.svg";

const EmptyTab = ({ message }: { message: string }) => (
  <div className="flex flex-col items-center justify-center py-12 text-gray-500 text-center">
    <img
      src={imgNotFound2}
      alt="no content"
      className="w-52 h-52 opacity-80 mb-4"
    />
    <p>{message}</p>
  </div>
);

export default EmptyTab;