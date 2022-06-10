import React, {useState, useContext, useRef, useEffect} from 'react'
import { Form, Row, Col, Button } from 'react-bootstrap'
import { useSelector } from 'react-redux'
import { AppContext } from '../context/appContext'
import './MessageForm.css'
import Picker from "emoji-picker-react"
import { BsEmojiSmileFill } from "react-icons/bs"
import styled from 'styled-components'

// import "./MessageForm.scss"




const MessageForm= () => {

  const [message, setMessage] = useState('');
  const user = useSelector((state)=> state.user);
  const { socket, currentRoom, messages, setMessages, privateMemberMsg} = useContext(AppContext)
  const messageEndRef = useRef(null);

  
  useEffect(() => {
    scrollToButton();
  }, [messages])
  

  const getFormatedDate= ()=>{
    const date = new Date();
    const year = date.getFullYear();

    let month = (1+date.getMonth()).toString();

    month = month.length > 1 ? month : "0" + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : "0" + day;
    
    return month + "/" + day + "/" + year;
  }

  

  const todayDate = getFormatedDate();
  socket.off('room-messages').on('room-messages', (roomMessages)=>{
    setMessages(roomMessages);
  })
  const handleSubmit = (e) => {
    e.preventDefault();
    if(!message) return;
    const today = new Date();
    const minutes = today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes();
    const time = today.getHours() + ":" + minutes;

    const roomId = currentRoom;
    socket.emit("message-room", roomId, message, user, time, todayDate);
    setMessage("");
  }

  const scrollToButton =()=>{
    messageEndRef.current.scrollIntoView({behaviour: "smooth"})
  }

  // emoji in the chat

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiPickerHideShow = () => {
    setShowEmojiPicker(!showEmojiPicker)
  }

  const handleEmojiClick = (event, emojiObject) => {
    let msg = message;
    msg += emojiObject.emoji;
    console.log(msg)

    // setMsg(msg)
    setMessage(msg);
  }
// console.log(privateMembersMsg);
  return (
    <>
      <MessageContainer>
        <div className='message-output'>
          {user && !privateMemberMsg._id && <div className='alert alert-info text-center'>You are in {currentRoom} room</div>}
          {user && privateMemberMsg._id &&
            <>
              <div className='alert alert-info conversation-info'>
                <div>
                  Your conversation with {privateMemberMsg.name}
                  <img src={privateMemberMsg.picture} className='conversation-profile-pic' alt='profile pic' />
                </div>
              </div>
            </>
          }
          {!user && <div className='alert alert-danger'>Please login</div>}

          {user &&
            messages.map(({ _id: date, messagesByDate }, idx) => {
              return (
                <div key={idx}>
                  <p className='alert alert-info text-center message-date-indicator'>{date}</p>
                  {messagesByDate.map(({ content, time, from }, msgIdx) => {
                    return (
                      <div className={from.email === user.email ? "outgoing-message" : "incoming-message"} key={msgIdx}>
                        <div className="message-inner">
                          <div className='d-flex align-items-center mb-3'>
                            <img src={from.picture} style={{ width: 35, height: 35, objectFit: "cover", borderRadius: "50%", marginRight: 10 }} alt='profile Pic' />
                            <p className="message-sender">{from._id === user._id ? "You" : from.name}</p>
                          </div>
                          <p className="message-content">{content}</p>
                          <p className="message-timestamp-left">{time}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
            })}
          < div ref={messageEndRef} />
        </div>
      </MessageContainer>
      
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={1}>
              <Container>
                <div className='emoji'>
                  <BsEmojiSmileFill onClick={handleEmojiPickerHideShow} />
                  {
                    showEmojiPicker && <Picker onEmojiClick={handleEmojiClick} />
                  }
                </div>
              </Container>
           
            </Col>
            <Col md={10}>
              <Form.Group>
                <Form.Control type='text' placeholder='Message' disabled={!user} value={message} onChange={(e) => setMessage(e.target.value)}></Form.Control>
              </Form.Group>
            </Col>
            <Col md={1}>
            <Button variant='success' type='submit' disabled={!user}>
                <i className='fas fa-paper-plane'></i>
              </Button>
            </Col>
          </Row>
        </Form>
    </>
    
  )
}

const Container = styled.div`
.emoji{
  position: relative;
  svg{
      font-size: 1.5rem;
      color: #ff9966ff;
      cursor: pointer;
  }
  .emoji-picker-react{
      position: absolute;
      top: -340px;
      background: #080420;
      box-shadow: 0 5px 10px #9186f3;
      border-color: #9186f3;
      .emoji-scroll-wrapper::-webkit-scrollbar{
          background: #080420;
          width: 5px;
          border-radius: 2px;
          &-thumb{
              background: #9186f3;
        }
  }
  .emoji-categories{
      button{
          filter: contrast(0);
      }
  }
  .emoji-search{
      background: transparent;
      border-color: #9186f3;
  }
  .emoji-group:before{
      background: #080420;
  }
}
`;

const MessageContainer= styled.div`
  .message-output::-webkit-scrollbar{
          background: #ffff;
          width: 5px;
          border-radius: 5px;
          &-thumb{
              background: #0199ff;
        }
`;

export default MessageForm