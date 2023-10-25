function App() {
    const { Container, Row, Col } = ReactBootstrap;
    return (
        <Container>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    <TableDisplay />
                </Col>
            </Row>
        </Container>
    );
}

function TableDisplay() {
    const [items, setItems] = React.useState([]);

    React.useEffect(() => {
        fetch('/items')
            .then((r) => r.json())
            .then(setItems);
    }, []);

    const onNewItems = React.useCallback(
        (items) => {
            setItems(items);
        },
        [items],
    );

    const onItemUpdate = React.useCallback(
        (item) => {
            const index = items.findIndex((i) => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = React.useCallback(
        (item) => {
            const index = items.findIndex((i) => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        },
        [items],
    );

    if (items === null) return 'Loading...';

    return (
        <React.Fragment>
            <FetchItemsForm onNewItems={onNewItems} />
            {items.length === 0 && (
                <p className="text-center">No todos</p>
            )}
            {items.map((item) => (
                <ItemDisplay
                    item={item}
                    key={item.id}
                    onItemUpdate={onItemUpdate}
                    onItemRemoval={onItemRemoval}
                />
            ))}
        </React.Fragment>
    );
}

function FetchItemsForm({ onNewItems }) {
    const { Form, Button } = ReactBootstrap;
    const [submitting, setSubmitting] = React.useState(false);

    const getItems = (e) => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/items')
            .then((r) => r.json())
            .then((items) => {
                onNewItems(items);
                setSubmitting(false);
            });
    };

    return (
        <Form onSubmit={getItems}>
            <Button
                type="submit"
                variant="success"
                className={submitting ? 'disabled' : ''}
            >
                {submitting ? 'Fetching...' : 'Fetch todos'}
            </Button>
        </Form>
    );
}

function ItemDisplay({ item }) {
    const { Container, Row, Col, Button } = ReactBootstrap;

    return (
        <Container fluid className={`item ${item.completed && 'completed'}`}>
            <Row>
                <Col xs={1} className="text-center">
                    
                </Col>
                <Col xs={10} className="name">
                    {item.name}
                </Col>
                <Col xs={1} className="text-center remove">
                    
                </Col>
            </Row>
        </Container>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
