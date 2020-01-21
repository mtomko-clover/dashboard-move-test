import React, {ReactElement} from "react";
import {useQuery} from "@apollo/react-hooks";
import {fetchAnnouncementItems} from "../../utils/queries";
import Announcement from "./Announcement";

const Announcements = (): ReactElement | null => {
    const { data, error, loading } = useQuery(fetchAnnouncementItems, {});
    if (error) {
        console.error(error);
        return null
    }

    return loading ? null : (
        <div>
            {data.announcements.map((announcement: any, index: any) => (
                <Announcement key={index} announcement={announcement} />
            ))}
        </div>
    )
};

export default Announcements;
