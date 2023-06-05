import { Modal, Spinner } from "native-base";

const LoaderModal = ({isLoading}) => {
  return (
    <Modal
    bgColor="transparent"
    shadow="none"
      isOpen={isLoading}
      size={"lg"}
    >
      <Modal.Content shadow="none" bgColor="transparent">
        <Modal.Body  shadow="none" bgColor="transparent">
          <Spinner size="lg" />
        </Modal.Body>
        </Modal.Content>
    </Modal>
  )
}

export default LoaderModal;