import styled from 'styled-components';

const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
`;

const StyledTh = styled.th`
    background: #f4f4f4;
    padding: 8px;
    text-align: left;
    border: 1px solid #ddd;
`;

const StyledTd = styled.td`
    padding: 8px;
    border: 1px solid #ddd;
`;

export { StyledTable, StyledTh, StyledTd };
