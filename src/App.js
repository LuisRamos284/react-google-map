import React, { useState } from "react";
import styled from "@emotion/styled";
import {
  Input,
  Button,
  Divider,
  Layout,
  Badge,
  List,
  notification,
} from "antd";
import GoogleMapReact from "google-map-react";
import { API_KEY } from "./env";

const { Header, Sider, Content } = Layout;

const Container = styled(Layout)({
  minHeight: "100vh",
});

const Left = styled(Sider)({
  backgroundColor: "#f1f1f1",
  padding: 5,
  paddingTop: 64,
});

const AppHeader = styled(Header)({
  backgroundColor: "#f1f1f1",
  textAlign: "center",
  fontWeight: "bold",
});

const ListTitle = styled.p({
  fontWeight: "bold",
  textTransform: "capitalize",
  margin: 0,
});

const ListDescription = styled.p({
  fontWeight: "100",
  fontsize: "10",
  margin: 0,
});

const AnyReactComponent = ({ position }) => <Badge count={position} />;

function App() {
  // Google Map and Maps objects
  const [map, setMap] = useState();
  const [maps, setMaps] = useState();

  const [loading, setLoading] = useState(true);
  const [marks, setMarks] = useState([]);
  const [currentMark, setCurrentMark] = useState();
  const [text, setText] = useState("");

  const openNotificationWithIcon = (type, text) => {
    notification[type]({
      message: type === "error" ? "Error!" : "Success!",
      description: text,
    });
  };

  const defaultProps = {
    center: {
      lat: 59.95,
      lng: 30.33,
    },
    zoom: 11,
  };

  const clear = () => {
    setText("");
    setCurrentMark(undefined);
  };

  const markPosition = () => {
    //adding the text, Ex : Caracas, Venezuela
    currentMark.text = text;
    const aux = [...marks, currentMark];
    map.setCenter(currentMark.position);
    setMarks(aux);
    openNotificationWithIcon("success", "Mark added succesfully");
    clear();
  };

  const TextToCoord = () => {
    new maps.Geocoder().geocode({ address: text }, (results, status) => {
      if (status === "OK") {
        // on Succes create a new marker and sets it has the current one
        const marker = new maps.Marker({
          map: map,
          position: results[0].geometry.location,
        });
        setCurrentMark(marker);
        openNotificationWithIcon(
          "success",
          "Coordinates Calculated succesfully"
        );
      } else {
        openNotificationWithIcon(
          "error",
          `Geocode was not successful for the following reason: ${status}`
        );
      }
    });
  };
  return (
    <Container>
      <Left>
        <Input
          value={text}
          placeholder="Direction"
          onChange={(evt) => setText(evt.target.value)}
        />
        <Divider orientation="left" />
        <Button type="primary" onClick={TextToCoord} disabled={loading}>
          Calc
        </Button>
        <Divider orientation="left" plain>
          Results
        </Divider>
        <Input
          placeholder="Lat"
          readOnly
          value={currentMark?.position.lat() ?? ""}
        />
        <Divider orientation="left" plain />
        <Input
          placeholder="Ing"
          readOnly
          value={currentMark?.position.lng() ?? ""}
        />
        <Divider orientation="left" plain />
        <Button
          type="primary"
          disabled={loading || !currentMark}
          onClick={markPosition}
        >
          Mark
        </Button>
        <Divider orientation="left" plain>
          Marks
        </Divider>
        <List
          itemLayout="horizontal"
          dataSource={marks}
          renderItem={(mark) => (
            <>
              <List.Item>
                <List.Item.Meta
                  style={{ cursor: "pointer" }}
                  onClick={() => map.setCenter(mark.position)}
                  title={<ListTitle> {mark.text} </ListTitle>}
                  description={
                    <>
                      <ListDescription>
                        {`Lat: ${mark.position.lat()}`}
                      </ListDescription>
                      <ListDescription>
                        {`Lng: ${mark.position.lng()}`}
                      </ListDescription>
                    </>
                  }
                />
              </List.Item>
              <Divider />
            </>
          )}
        />
      </Left>
      <Layout>
        <AppHeader>Google Map Api Test</AppHeader>
        <Content>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: API_KEY,
            }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            onGoogleApiLoaded={({ map, maps }) => {
              // Capture map and Maps so you can use it later
              setMap(map);
              setMaps(maps);
              setLoading(false);
            }}
            yesIWantToUseGoogleMapApiInternals
          >
            {marks.map((mark, index) => (
              <AnyReactComponent
                lat={mark.position.lat()}
                lng={mark.position.lng()}
                position={index + 1}
              />
            ))}
          </GoogleMapReact>
        </Content>
      </Layout>
    </Container>
  );
}

export default App;
