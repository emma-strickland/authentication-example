import React from "react";
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
  },
};

const Home = () => {
  // const getUser = () => {
  //     const requestOptionsGetUser = {
  //         method: 'GET',
  //         headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer${token}`
  //         }
  //     }
  //     fetch(`${config.API_BASE_URL}/user`, requestOptionsGetUser)
  //         .catch(error => {
  //             console.log('error: ', error);
  //         })
  // }
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = '#f00';
  }

  function closeModal() {
    setIsOpen(false);
  }

  return (
    <div>
      <h1>
        Home
      </h1>
      <div>
        <button onClick={openModal}>Open Modal</button>
        <Modal
          isOpen={modalIsOpen}
          onAfterOpen={afterOpenModal}
          onRequestClose={closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >
          <h2 ref={(_subtitle) => (subtitle = _subtitle)}>Hello</h2>
          <button onClick={closeModal}>close</button>
          <div>I am a modal</div>
          <form>
            <input />
            <button>tab navigation</button>
            <button>stays</button>
            <button>inside</button>
            <button>the modal</button>
          </form>
        </Modal>
      </div>
      {/* <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p>
      <p>it's my bobino it's boberino</p> */}
    </div>
  )
}

export default Home;