import { mdiLoading } from "@mdi/js";
import Icon from "@mdi/react";

export default function LoadingState () {
    return (
        <p style={{display: "flex", flexDirection: "column", alignItems: "center", gap: 8}}>
        <Icon path={mdiLoading} size={1} spin={0.7} />
        Loading
      </p>
    )
}