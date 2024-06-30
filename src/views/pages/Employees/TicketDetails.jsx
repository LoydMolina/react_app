import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Avatar_05, Avatar_08, Avatar_09, Avatar_10, Avatar_11 } from '../../../Routes/ImagePath'
import axios from 'axios';
import moment from 'moment';

const TicketDetails = () => {
    const { id } = useParams();
    const [ticket, setTicket] = useState(null);
    const [companyName, setCompanyName] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activities, setActivities] = useState([]);


    useEffect(() => {
        const fetchActivities = async () => {
            try {
                const response = await axios.get(`https://wd79p.com/backend/public/api/tickets/${id}/activities`);
                setActivities(response.data);
            } catch (error) {
                setError(error);
            }
        };

        if (ticket) {
            fetchActivities();
        }
    }, [id, ticket]);

    useEffect(() => {
        const fetchTicketDetails = async () => {
            try {
                const response = await axios.get(`https://wd79p.com/backend/public/api/tickets/${id}`);
                const ticketData = response.data;
                setTicket(ticketData);

                if (ticketData && ticketData.company_id) {
                    const companyResponse = await axios.get(`https://wd79p.com/backend/public/api/companies/${ticketData.company_id}`);
                    setCompanyName(companyResponse.data.name);
                }
                setLoading(false);

            } catch (error) {
                    setError(error);
                    setLoading(false);
                }
        };

        fetchTicketDetails();
    }, [id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading ticket details: {error.message}</div>;
    }

    const navigateToTicketPage = () => {
        window.location.href = '/tickets';
    };


    return (
        <>
            <div className="page-wrapper">
                <div className="content container-fluid">
                    <div className="page-header">
                        <div className="row align-items-center">
                            <div className="col-md-4">
                                <h3 className="page-title mb-0">Ticket Detail</h3>
                            </div>
                            <div className="col-md-8 float-end ms-auto">
                            <div className="d-flex title-head">
                            <Link to="#" className="btn btn-link" onClick={navigateToTicketPage}>
                                <i className="las la-arrow-left" /> Back
                            </Link>
                            </div>
                        </div>
                        </div>
                    </div>
                    <hr />
                    <div className="row">
                        <div className="col-xl-8 col-lg-7">
                            <div className="ticket-detail-head">
                                <div className="row">
                                <div className="col-xxl-3 col-md-6">
                                        <div className="ticket-head-card">
                                            <span className="ticket-detail-icon">
                                                <i className="la la-stop-circle" />
                                            </span>
                                            <div className="detail-info">
                                                <h6>Ticket Id</h6>
                                                <span className="badge badge-soft-warning">
                                                    {ticket.id}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-3 col-md-6">
                                        <div className="ticket-head-card">
                                            <span className="ticket-detail-icon">
                                                <i className="la la-stop-circle" />
                                            </span>
                                            <div className="detail-info">
                                                <h6>Status</h6>
                                                <span className="badge badge-soft-warning">
                                                    {ticket.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-3 col-md-6">
                                        <div className="ticket-head-card">
                                            <span className="ticket-detail-icon bg-danger-lights">
                                                <i className="la la-user" />
                                            </span>
                                            <div className="detail-info info-two">
                                                <h6>Company</h6>
                                                {companyName}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xxl-3 col-md-6">
                                    <div className="ticket-head-card">
                                        <span className="ticket-detail-icon bg-warning-lights">
                                            <i className="la la-calendar" />
                                        </span>
                                        <div className="detail-info info-two">
                                            <h6>Created Date</h6>
                                            <span>
                                                {new Date(ticket.created_at).toLocaleString('en-US', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: 'numeric',
                                                    minute: 'numeric',
                                                    hour12: true
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                    <div className="col-xxl-3 col-md-6">
                                        <div className="ticket-head-card">
                                            <span className="ticket-detail-icon bg-purple-lights">
                                                <i className="la la-info-circle" />
                                            </span>
                                            <div className="detail-info">
                                                <h6>Priority</h6>
                                                <span>
                                                    {ticket.priority}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="ticket-purpose">
                                <h4>{ticket.subject}</h4>
                                <ul>
                                {ticket.description}
                                </ul>
                            </div>
                            <div className="attached-files-info">
                                <div className="row">
                                    <div className="col-xxl-6">
                                        <div className="attached-files">
                                            <ul>
                                               {/* files here */}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-xxl-6">
                                        <div className="attached-files media-attached-files">
                                            <ul>
                                                {/* files here */}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="reply">
                            <textarea id="replyTextArea" rows="4" style={{ width: '100%' }} placeholder="Type your reply here..."></textarea>
                            <button type="button" style={{ backgroundColor: '#FFCC80' }}>Reply</button>
                            </div>
                        </div>
                        <div className="col-xl-4 col-lg-5 theiaStickySidebar">
    <div className='stickybar'>
        <div className="ticket-chat">
            <h4>Activity Log</h4>
            <table>
                <thead>
                    <tr>
                        <th>Action</th>
                        <th>Created At</th>
                    </tr>
                </thead>
                <tbody>
                    {activities.map(activity => (
                        <tr key={activity.id}>
                            <td>{activity.action}</td>
                            <td>{moment(activity.created_at).format('MMMM DD, YYYY [at] h:mma')}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
</div>
                    </div>
                </div>
                
                {/* Edit Ticket Modal */}
                <div id="edit_ticket" className="modal custom-modal fade" role="dialog">
                    <div
                        className="modal-dialog modal-dialog-centered modal-lg"
                        role="document"
                    >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit Ticket</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <form>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="input-block mb-3">
                                                <label className="col-form-label">Ticket Subject</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    defaultValue="Laptop Issue"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-block mb-3">
                                                <label className="col-form-label">Ticket Id</label>
                                                <input
                                                    className="form-control"
                                                    type="text"
                                                    readOnly=""
                                                    defaultValue="TKT-0001"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="input-block mb-3">
                                                <label className="col-form-label">Assign Staff</label>
                                                <select className="select">
                                                    <option>-</option>
                                                    <option selected="">Mike Litorus</option>
                                                    <option>John Smith</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-block mb-3">
                                                <label className="col-form-label">Client</label>
                                                <select className="select">
                                                    <option>-</option>
                                                    <option>Delta Infotech</option>
                                                    <option selected="">International Software Inc</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="input-block mb-3">
                                                <label className="col-form-label">Priority</label>
                                                <select className="select">
                                                    <option>High</option>
                                                    <option selected="">Medium</option>
                                                    <option>Low</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-block mb-3">
                                                <label className="col-form-label">CC</label>
                                                <input className="form-control" type="text" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="input-block mb-3">
                                                <label className="col-form-label">Assign</label>
                                                <input type="text" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-block mb-3">
                                                <label className="col-form-label">Ticket Assignee</label>
                                                <div className="project-members">
                                                    <Link title="John Smith" data-bs-toggle="tooltip" to="#">
                                                        <img
                                                            src={Avatar_10}
                                                            alt="img"
                                                        />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="input-block mb-3">
                                                <label className="col-form-label">Add Followers</label>
                                                <input type="text" className="form-control" />
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="input-block mb-3">
                                                <label className="col-form-label">Ticket Followers</label>
                                                <div className="project-members">
                                                    <Link
                                                        title="Richard Miles"
                                                        data-bs-toggle="tooltip"
                                                        to="#"
                                                        className="avatar"
                                                    >
                                                        <img
                                                            src={Avatar_09}
                                                            alt="img"
                                                        />
                                                    </Link>
                                                    <Link
                                                        title="John Smith"
                                                        data-bs-toggle="tooltip"
                                                        to="#"
                                                        className="avatar"
                                                    >
                                                        <img
                                                            src={Avatar_10}
                                                            alt="img"
                                                        />
                                                    </Link>
                                                    <Link
                                                        title="Mike Litorus"
                                                        data-bs-toggle="tooltip"
                                                        to="#"
                                                        className="avatar"
                                                    >
                                                        <img
                                                            src={Avatar_05}
                                                            alt="img"
                                                        />
                                                    </Link>
                                                    <Link
                                                        title="Wilmer Deluna"
                                                        data-bs-toggle="tooltip"
                                                        to="#"
                                                        className="avatar"
                                                    >
                                                        <img
                                                            src={Avatar_11}
                                                            alt="img"
                                                        />
                                                    </Link>
                                                    <span className="all-team">+2</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col-md-12">
                                            <div className="input-block mb-3">
                                                <label className="col-form-label">Description</label>
                                                <textarea
                                                    className="form-control"
                                                    rows={4}
                                                    defaultValue={""}
                                                />
                                            </div>
                                            <div className="input-block mb-3">
                                                <label className="col-form-label">Upload Files</label>
                                                <input className="form-control" type="file" />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="submit-section">
                                        <button className="btn btn-primary submit-btn">Save</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Edit Ticket Modal */}
                {/* Delete Ticket Modal */}
                <div className="modal custom-modal fade" id="delete_ticket" role="dialog">
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-body">
                                <div className="form-header">
                                    <h3>Delete Ticket</h3>
                                    <p>Are you sure want to delete?</p>
                                </div>
                                <div className="modal-btn delete-action">
                                    <div className="row">
                                        <div className="col-6">
                                            <Link
                                                to="#"
                                                className="btn btn-primary continue-btn"
                                            >
                                                Delete
                                            </Link>
                                        </div>
                                        <div className="col-6">
                                            <Link
                                                to="#"
                                                data-bs-dismiss="modal"
                                                className="btn btn-primary cancel-btn"
                                            >
                                                Cancel
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Delete Ticket Modal */}
                {/* Assignee Modal */}
                <div id="assignee" className="modal custom-modal fade" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Assign to this task</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="input-group m-b-30">
                                    <input
                                        placeholder="Search to add"
                                        className="form-control search-input"
                                        type="text"
                                    />
                                    <button className="btn btn-primary">Search</button>
                                </div>
                                <div>
                                    <ul className="chat-user-list">
                                        <li>
                                            <Link to="#">
                                                <div className="chat-block d-flex">
                                                    <span className="avatar">
                                                        <img
                                                            src={Avatar_11}
                                                            alt="img"
                                                        />
                                                    </span>
                                                    <div className="media-body align-self-center text-nowrap">
                                                        <div className="user-name">Richard Miles</div>
                                                        <span className="designation">Web Developer</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <div className="chat-block d-flex">
                                                    <span className="avatar">
                                                        <img
                                                            src={Avatar_10}
                                                            alt="img"
                                                        />
                                                    </span>
                                                    <div className="media-body align-self-center text-nowrap">
                                                        <div className="user-name">John Smith</div>
                                                        <span className="designation">Android Developer</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <div className="chat-block d-flex">
                                                    <span className="avatar">
                                                        <img
                                                            src={Avatar_10}
                                                            alt="img"
                                                        />
                                                    </span>
                                                    <div className="media-body align-self-center text-nowrap">
                                                        <div className="user-name">Jeffery Lalor</div>
                                                        <span className="designation">Team Leader</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="submit-section">
                                    <button className="btn btn-primary submit-btn">Assign</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Assignee Modal */}
                {/* Task Followers Modal */}
                <div id="task_followers" className="modal custom-modal fade" role="dialog">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add followers to this task</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                >
                                    <span aria-hidden="true">×</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="input-group m-b-30">
                                    <input
                                        placeholder="Search to add"
                                        className="form-control search-input"
                                        type="text"
                                    />
                                    <button className="btn btn-primary">Search</button>
                                </div>
                                <div>
                                    <ul className="chat-user-list">
                                        <li>
                                            <Link to="#">
                                                <div className="chat-block d-flex">
                                                    <span className="avatar">
                                                        <img
                                                            src={Avatar_10}
                                                            alt="img"
                                                        />
                                                    </span>
                                                    <div className="media-body media-middle text-nowrap">
                                                        <div className="user-name">Jeffery Lalor</div>
                                                        <span className="designation">Team Leader</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <div className="chat-block d-flex">
                                                    <span className="avatar">
                                                        <img
                                                            src={Avatar_08}
                                                            alt="img"
                                                        />
                                                    </span>
                                                    <div className="media-body media-middle text-nowrap">
                                                        <div className="user-name">Catherine Manseau</div>
                                                        <span className="designation">Android Developer</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link to="#">
                                                <div className="chat-block d-flex">
                                                    <span className="avatar">
                                                        <img
                                                            src={Avatar_11}
                                                            alt="img"
                                                        />
                                                    </span>
                                                    <div className="media-body media-middle text-nowrap">
                                                        <div className="user-name">Wilmer Deluna</div>
                                                        <span className="designation">Team Leader</span>
                                                    </div>
                                                </div>
                                            </Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="submit-section">
                                    <button className="btn btn-primary submit-btn">
                                        Add to Follow
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* /Task Followers Modal */}
            </div>
            {/* /Page Wrapper */}
        </>

    )
}

export default TicketDetails
