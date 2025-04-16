import * as React from "react";
import styled from "styled-components";

export default function Footer() {
  return (
    <StyleFooter>
      <div className="content">
        <ul className="list-footer">
          <li>
            <a>Giới thiệu &#8226;</a>
          </li>
          <li>
            <a>Điều khoản &#8226;</a>
          </li>
          <li>
            <a>Ngôn ngữ &#8226;</a>
          </li>
          <li>
            <a>Vị trí</a>
          </li>
        </ul>
        <span>© Make by VietBui</span>
      </div>
    </StyleFooter>
  );
}

const StyleFooter = styled.div`
  padding-bottom: 40px;

  .list-footer {
    display: flex;
    flex-wrap: wrap;
    margin-left: -2px;
    margin-right: -2px;
    margin-bottom: 16px;
    justify-content: center;
  }

  .list-footer li {
    margin: 2px;
  }

  .list-footer li a {
    font-size: 12px;
    color: #c7c7c7;
    font-weight: 400;
  }

  span {
    font-size: 12px;
    color: #c7c7c7;
    font-weight: 400;
  }
`;
