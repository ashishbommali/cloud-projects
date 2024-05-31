import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const Modal = ({visible, setVisible, children}) => {
  return (
    visible && (<div className="fixed bg-[#00000073] h-screen w-full top-0 left-0 grid grid-rows-[max-content_auto] p-8">
        <div className="flex justify-end">
            <button className='text-3xl text-white' onClick={setVisible}><FontAwesomeIcon icon={faXmark}/></button>
        </div>
        <div className="flex items-center justify-center">
            {children}
        </div>
    </div>)
  )
}

export default Modal