import React from 'react'
import Modal from '../components/Modal';

const DashboardPage = () => {
  return (
    <>
        <div className="dashboard-page-wrapper">
            <div className="dashboard-header">
                <h1>Welcome, God!</h1>
                <div className="dashboard-actions">
                    <div className="join-doc-group">
                        <input
                            type="text"
                            className="inputBox"
                            placeholder="Enter Document ID to Join"
                            // value={joinId}
                            // onChange={(e) => setJoinId(e.target.value)}
                        />
                        <button className="btn">
                            Join
                        </button>
                    </div>
                    <button className="btn joinBtn">
                        + Create New Document
                    </button>
                </div>
            </div>

            <h2>Your Documents</h2>

            <p>You have no documents yet. Create one to get started!</p>
        </div>
    </>
  )
}

export default DashboardPage;
