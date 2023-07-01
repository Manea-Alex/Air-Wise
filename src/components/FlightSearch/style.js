import styled from "styled-components";

// Main container for the form
export const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 1270px;
  margin: 0 auto;
  // padding: 1rem;
`;

// Group for all form fields
export const InputGroup = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  flex-wrap: wrap; // Change nowrap to wrap
  margin-bottom: 1rem;
  width: 100%;
`;
export const Input = styled.input`
  width:100%
  margin-right: 1rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  height:25px;
`;

// Search button with styling
export const Button = styled.button`
  padding: 0.4rem 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #00a991;
  color: #fff;
  cursor: pointer;
  height: 38px; 
  line-height: 24px; 
  font-size: 15px;
  font-weight:550 !important;
  font-family:font-family: "Circular Pro", -apple-system, ".SFNSText-Regular",
    "San Francisco", "Segoe UI", "Helvetica Neue", "Lucida Grande", sans-serif;

    &:hover {
    background-color: #009882 ;
    border-color: #00876d;
  }
  user-select:none;

`;

// Container for search button
export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;
